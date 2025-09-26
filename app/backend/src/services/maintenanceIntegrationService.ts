import { db } from "@db/index.js";
import { maintenanceLogTable, maintenanceOrderTable } from "@db/schema/index.js";
import { eq } from "drizzle-orm";
import * as maintenanceOrderService from "./maintenanceOrderService.js";
import * as maintenanceLogService from "./maintenanceLogService.js";

/**
 * Servicio de integración entre órdenes y registros de mantenimiento
 * Maneja la creación automática bidireccional entre ambos sistemas
 */

export interface MaintenanceLogWithIntegration {
  date: string;
  odometer: number;
  serviceCenter: string;
  cost: number;
  notes?: string;
  autoGenerateOrder?: boolean; // Si debe generar orden automáticamente
  orderDetails?: {
    reportedIssue?: string;
    createdBy: string;
    workshopName?: string;
  };
}

export interface MaintenanceOrderCloseData {
  orderId: string;
  finalCost?: number;
  completionDate?: string;
  finalOdometer?: number;
  autoGenerateLog?: boolean; // Si debe generar log automáticamente
}

/**
 * Crea un registro de mantenimiento con opción de generar orden automáticamente
 */
export const createMaintenanceLogWithIntegration = async (
  vehicleId: string,
  logData: MaintenanceLogWithIntegration,
) => {
  // 1. Crear el registro de mantenimiento
  const logResult = await maintenanceLogService.addMaintenanceLog(vehicleId, {
    date: logData.date,
    odometer: logData.odometer,
    serviceCenter: logData.serviceCenter,
    cost: logData.cost,
    notes: logData.notes,
    autoGenerateOrder: logData.autoGenerateOrder ? 1 : 0,
  });

  const logId = logResult.id;

  // 2. Si se solicita, generar orden automáticamente
  if (logData.autoGenerateOrder && logData.orderDetails) {
    try {
      const orderResult = await maintenanceOrderService.createMaintenanceOrder(
        vehicleId,
        {
          reportedIssue: logData.orderDetails.reportedIssue || 
            `Seguimiento de mantenimiento realizado en ${logData.serviceCenter}`,
          createdBy: logData.orderDetails.createdBy,
          status: "pending_review",
          workshop: logData.orderDetails.workshopName ? {
            name: logData.orderDetails.workshopName
          } : undefined,
          notes: `Orden generada automáticamente desde registro de mantenimiento. Costo: $${logData.cost}`,
        }
      );

      // 3. Actualizar las referencias cruzadas
      await db
        .update(maintenanceLogTable)
        .set({ generatedOrderId: orderResult.id })
        .where(eq(maintenanceLogTable.id, logId));

      await db
        .update(maintenanceOrderTable)
        .set({ sourceLogId: logId })
        .where(eq(maintenanceOrderTable.id, orderResult.id));

      return {
        log: { ...logResult, generatedOrderId: orderResult.id },
        order: orderResult,
        message: "Registro de mantenimiento creado y orden generada automáticamente"
      };
    } catch (error) {
      console.error("Error generando orden automática:", error);
      return {
        log: logResult,
        order: null,
        message: "Registro creado, pero falló la generación automática de orden",
        error: error instanceof Error ? error.message : "Error desconocido"
      };
    }
  }

  return {
    log: logResult,
    order: null,
    message: "Registro de mantenimiento creado exitosamente"
  };
};

/**
 * Cierra una orden de mantenimiento con opción de generar registro automáticamente
 */
export const closeMaintenanceOrderWithIntegration = async (
  closeData: MaintenanceOrderCloseData,
) => {
  // 1. Obtener la orden actual
  const order = await maintenanceOrderService.getMaintenanceOrderById(closeData.orderId);
  
  // 2. Cerrar la orden
  const updatedOrder = await maintenanceOrderService.updateMaintenanceOrder(
    closeData.orderId,
    {
      status: "closed",
      totalFinal: closeData.finalCost ?? (order.totalEstimated ?? undefined),
      paymentStatus: "paid",
    }
  );

  // 3. Si se solicita, generar registro automáticamente
  if (closeData.autoGenerateLog) {
    try {
      const logResult = await maintenanceLogService.addMaintenanceLog(
        order.vehicleId,
        {
          date: closeData.completionDate || new Date().toISOString().split('T')[0],
          odometer: closeData.finalOdometer || 0,
          serviceCenter: order.workshop?.name || "Taller no especificado",
          cost: closeData.finalCost || order.totalEstimated || 0,
          notes: `Registro generado automáticamente desde orden: ${order.reportedIssue}`,
          relatedOrderId: closeData.orderId,
        }
      );

      // 4. Actualizar la referencia en la orden
      await db
        .update(maintenanceOrderTable)
        .set({ generatedLogId: logResult.id })
        .where(eq(maintenanceOrderTable.id, closeData.orderId));

      return {
        order: updatedOrder,
        log: logResult,
        message: "Orden cerrada y registro de mantenimiento generado automáticamente"
      };
    } catch (error) {
      console.error("Error generando registro automático:", error);
      return {
        order: updatedOrder,
        log: null,
        message: "Orden cerrada, pero falló la generación automática de registro",
        error: error instanceof Error ? error.message : "Error desconocido"
      };
    }
  }

  return {
    order: updatedOrder,
    log: null,
    message: "Orden de mantenimiento cerrada exitosamente"
  };
};

/**
 * Obtiene el historial integrado de mantenimiento (órdenes + registros)
 */
export const getIntegratedMaintenanceHistory = async (vehicleId: string) => {
  const [orders, logs] = await Promise.all([
    maintenanceOrderService.getMaintenanceOrdersByVehicle(vehicleId),
    maintenanceLogService.getMaintenanceLogs(vehicleId),
  ]);

  // Combinar y ordenar por fecha
  const integratedHistory = [
    ...orders.map(order => ({
      type: 'order' as const,
      id: order.id,
      date: order.created_at,
      description: order.reportedIssue,
      status: order.status,
      cost: order.totalFinal || order.totalEstimated,
      relatedId: order.generatedLogId || order.sourceLogId,
      data: order
    })),
    ...logs.map(log => ({
      type: 'log' as const,
      id: log.id,
      date: log.date,
      description: `Mantenimiento en ${log.serviceCenter}`,
      status: 'completed',
      cost: log.cost,
      relatedId: log.relatedOrderId || log.generatedOrderId,
      data: log
    }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return integratedHistory;
};

/**
 * Obtiene estadísticas del mantenimiento integrado
 */
export const getMaintenanceStatistics = async (vehicleId: string) => {
  const [orders, logs] = await Promise.all([
    maintenanceOrderService.getMaintenanceOrdersByVehicle(vehicleId),
    maintenanceLogService.getMaintenanceLogs(vehicleId),
  ]);

  const totalOrders = orders.length;
  const openOrders = orders.filter(o => o.status !== 'closed' && o.status !== 'rejected').length;
  const closedOrders = orders.filter(o => o.status === 'closed').length;
  const totalLogs = logs.length;
  
  const totalCostFromOrders = orders
    .filter(o => o.status === 'closed')
    .reduce((sum, o) => sum + (o.totalFinal || o.totalEstimated || 0), 0);
  
  const totalCostFromLogs = logs.reduce((sum, l) => sum + l.cost, 0);
  
  const integratedRecords = logs.filter(l => l.relatedOrderId).length;
  const autoGeneratedOrders = orders.filter(o => o.sourceLogId).length;

  return {
    summary: {
      totalOrders,
      openOrders,
      closedOrders,
      totalLogs,
      totalCostFromOrders,
      totalCostFromLogs,
      totalCombinedCost: totalCostFromOrders + totalCostFromLogs
    },
    integration: {
      integratedRecords,
      autoGeneratedOrders,
      integrationRate: totalLogs > 0 ? (integratedRecords / totalLogs) * 100 : 0
    }
  };
};