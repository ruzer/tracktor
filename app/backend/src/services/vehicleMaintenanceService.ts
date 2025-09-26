import { db } from "@db/index.js";
import {
  invoiceTable,
  serviceOrderTable,
  vehicleMaintenanceTable,
} from "@db/schema/index.js";
import { VehicleError } from "@exceptions/VehicleError.js";
import { Status } from "@exceptions/ServiceError.js";
import { eq } from "drizzle-orm";

export type MaintenanceStatus = "pending" | "in_progress" | "completed";

export const listByVehicle = async (vehicleId: string) => {
  const rows = await db
    .select({
      maintenance: vehicleMaintenanceTable,
      serviceOrder: serviceOrderTable,
      invoice: invoiceTable,
    })
    .from(vehicleMaintenanceTable)
    .leftJoin(
      serviceOrderTable,
      eq(serviceOrderTable.id, vehicleMaintenanceTable.serviceOrderId),
    )
    .leftJoin(invoiceTable, eq(invoiceTable.id, vehicleMaintenanceTable.invoiceId))
    .where(eq(vehicleMaintenanceTable.vehicleId, vehicleId));

  return rows.map(({ maintenance, serviceOrder, invoice }) => ({
    id: maintenance.id,
    vehicleId: maintenance.vehicleId,
    title: maintenance.title,
    notes: maintenance.notes,
    status: maintenance.status as MaintenanceStatus,
    serviceOrder: serviceOrder
      ? {
          id: serviceOrder.id,
          description: serviceOrder.description,
          provider: serviceOrder.provider,
          estimatedCost: serviceOrder.estimatedCost,
          finalCost: serviceOrder.finalCost,
          invoiceId: serviceOrder.invoiceId,
          createdAt: serviceOrder.created_at,
          updatedAt: serviceOrder.updated_at,
        }
      : null,
    invoice: invoice
      ? {
          id: invoice.id,
          fileUrl: invoice.fileUrl,
          amount: invoice.amount,
          issuedAt: invoice.issuedAt,
          provider: invoice.provider,
          createdAt: invoice.created_at,
          updatedAt: invoice.updated_at,
        }
      : null,
    createdAt: maintenance.created_at,
    updatedAt: maintenance.updated_at,
  }));
};

export const createMaintenance = async (
  vehicleId: string,
  payload: {
    title: string;
    notes?: string;
    description?: string;
    provider?: string;
    estimatedCost?: number;
  },
) => {
  if (!payload.title && !payload.description) {
    throw new VehicleError(
      "Maintenance title or description is required.",
      Status.BAD_REQUEST,
    );
  }

  const [maintenance] = await db
    .insert(vehicleMaintenanceTable)
    .values({
      vehicleId,
      title: payload.title || payload.description || "Maintenance",
      notes: payload.notes,
    })
    .returning();

  if (!maintenance?.id) {
    throw new VehicleError(
      "Maintenance record could not be created.",
      Status.INTERNAL_SERVER_ERROR,
    );
  }

  let serviceOrderId: string | undefined;
  if (payload.description || payload.provider || payload.estimatedCost) {
    const [serviceOrder] = await db
      .insert(serviceOrderTable)
      .values({
        vehicleId,
        description: payload.description || maintenance.title,
        provider: payload.provider,
        estimatedCost: payload.estimatedCost,
      })
      .returning();
    serviceOrderId = serviceOrder?.id;
  }

  if (serviceOrderId) {
    await db
      .update(vehicleMaintenanceTable)
      .set({ serviceOrderId })
      .where(eq(vehicleMaintenanceTable.id, maintenance.id));
  }

  return getMaintenanceById(maintenance.id);
};

const getMaintenanceById = async (maintenanceId: string) => {
  const [row] = await db
    .select({
      maintenance: vehicleMaintenanceTable,
      serviceOrder: serviceOrderTable,
      invoice: invoiceTable,
    })
    .from(vehicleMaintenanceTable)
    .leftJoin(
      serviceOrderTable,
      eq(serviceOrderTable.id, vehicleMaintenanceTable.serviceOrderId),
    )
    .leftJoin(invoiceTable, eq(invoiceTable.id, vehicleMaintenanceTable.invoiceId))
    .where(eq(vehicleMaintenanceTable.id, maintenanceId));

  if (!row) {
    throw new VehicleError("Maintenance not found", Status.NOT_FOUND);
  }

  return {
    id: row.maintenance.id,
    vehicleId: row.maintenance.vehicleId,
    title: row.maintenance.title,
    notes: row.maintenance.notes,
    status: row.maintenance.status as MaintenanceStatus,
    serviceOrder: row.serviceOrder,
    invoice: row.invoice,
    createdAt: row.maintenance.created_at,
    updatedAt: row.maintenance.updated_at,
  };
};

export const updateMaintenanceStatus = async (
  maintenanceId: string,
  status: MaintenanceStatus,
) => {
  await db
    .update(vehicleMaintenanceTable)
    .set({ status })
    .where(eq(vehicleMaintenanceTable.id, maintenanceId));

  return getMaintenanceById(maintenanceId);
};

export const attachInvoice = async (
  maintenanceId: string,
  payload: {
    fileUrl: string;
    amount?: number;
    issuedAt?: string;
    provider?: string;
  },
) => {
  const maintenanceRecord = await db
    .select()
    .from(vehicleMaintenanceTable)
    .where(eq(vehicleMaintenanceTable.id, maintenanceId));

  if (maintenanceRecord.length === 0) {
    throw new VehicleError("Maintenance not found", Status.NOT_FOUND);
  }

  const [invoice] = await db
    .insert(invoiceTable)
    .values({
      fileUrl: payload.fileUrl,
      amount: payload.amount,
      issuedAt: payload.issuedAt,
      provider: payload.provider,
    })
    .returning();

  if (maintenanceRecord[0].serviceOrderId) {
    await db
      .update(serviceOrderTable)
      .set({
        invoiceId: invoice.id,
        finalCost: payload.amount ?? undefined,
      })
      .where(eq(serviceOrderTable.id, maintenanceRecord[0].serviceOrderId));
  }
  await db
    .update(vehicleMaintenanceTable)
    .set({ invoiceId: invoice.id })
    .where(eq(vehicleMaintenanceTable.id, maintenanceId));

  return getMaintenanceById(maintenanceId);
};
