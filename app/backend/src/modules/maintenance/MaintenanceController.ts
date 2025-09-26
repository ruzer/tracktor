import { Request, Response, Router } from "express";
import { IModuleController } from "../../core/interfaces/IModule.js";
import { MaintenanceService } from "./MaintenanceService.js";

/**
 * Controlador del módulo de Mantenimiento
 * Maneja las peticiones HTTP para operaciones de mantenimiento
 */
export class MaintenanceController implements IModuleController {
  private service: MaintenanceService;

  constructor(service: MaintenanceService) {
    this.service = service;
  }

  /**
   * Inicializar el controlador
   */
  async initialize(): Promise<void> {
    console.log("Inicializando controlador de Mantenimiento...");
  }

  /**
   * Limpiar recursos del controlador
   */
  async cleanup(): Promise<void> {
    console.log("Limpiando recursos del controlador de Mantenimiento...");
  }

  // ==================== ENDPOINTS CRUD ====================

  /**
   * Crear un nuevo registro de mantenimiento
   * POST /api/maintenance
   */
  async create(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.service.create(req.body);
      res.status(201).json({
        success: true,
        data: result,
        message: "Registro de mantenimiento creado exitosamente"
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Error interno del servidor"
      });
    }
  }

  /**
   * Obtener un registro de mantenimiento por ID
   * GET /api/maintenance/:id
   */
  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const result = await this.service.getById(id);
      
      if (!result) {
        res.status(404).json({
          success: false,
          message: "Registro de mantenimiento no encontrado"
        });
        return;
      }

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Error interno del servidor"
      });
    }
  }

  /**
   * Obtener todos los registros de mantenimiento
   * GET /api/maintenance
   */
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const filters = req.query;
      const results = await this.service.getAll(filters);
      
      res.json({
        success: true,
        data: results,
        count: results.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Error interno del servidor"
      });
    }
  }

  /**
   * Actualizar un registro de mantenimiento
   * PUT /api/maintenance/:id
   */
  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const result = await this.service.update(id, req.body);
      
      res.json({
        success: true,
        data: result,
        message: "Registro de mantenimiento actualizado exitosamente"
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Error interno del servidor"
      });
    }
  }

  /**
   * Eliminar un registro de mantenimiento
   * DELETE /api/maintenance/:id
   */
  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const success = await this.service.delete(id);
      
      if (!success) {
        res.status(404).json({
          success: false,
          message: "Registro de mantenimiento no encontrado o no se pudo eliminar"
        });
        return;
      }

      res.json({
        success: true,
        message: "Registro de mantenimiento eliminado exitosamente"
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Error interno del servidor"
      });
    }
  }

  // ==================== ENDPOINTS ESPECÍFICOS DEL MÓDULO ====================

  /**
   * Crear una nueva orden de mantenimiento
   * POST /api/maintenance/orders
   */
  async createOrder(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.service.createOrder(req.body);
      res.status(201).json({
        success: true,
        data: result,
        message: "Orden de mantenimiento creada exitosamente"
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Error interno del servidor"
      });
    }
  }

  /**
   * Obtener órdenes de mantenimiento por vehículo
   * GET /api/maintenance/orders/vehicle/:vehicleId
   */
  async getOrdersByVehicle(req: Request, res: Response): Promise<void> {
    try {
      const { vehicleId } = req.params;
      const results = await this.service.getOrdersByVehicle(vehicleId);
      
      res.json({
        success: true,
        data: results,
        count: results.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Error interno del servidor"
      });
    }
  }

  /**
   * Crear un nuevo log de mantenimiento
   * POST /api/maintenance/logs
   */
  async createLog(req: Request, res: Response): Promise<void> {
    try {
      const { vehicleId } = req.body;
      const result = await this.service.createLog(vehicleId, req.body);
      res.status(201).json({
        success: true,
        data: result,
        message: "Log de mantenimiento creado exitosamente"
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Error interno del servidor"
      });
    }
  }

  /**
   * Obtener logs de mantenimiento por vehículo
   * GET /api/maintenance/logs/vehicle/:vehicleId
   */
  async getLogsByVehicle(req: Request, res: Response): Promise<void> {
    try {
      const { vehicleId } = req.params;
      const results = await this.service.getLogsByVehicle(vehicleId);
      
      res.json({
        success: true,
        data: results,
        count: results.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Error interno del servidor"
      });
    }
  }

  // ==================== ENDPOINTS DE REPORTES ====================

  /**
   * Generar reportes de mantenimiento
   * GET /api/maintenance/reports/:type
   */
  async generateReport(req: Request, res: Response): Promise<void> {
    try {
      const { type } = req.params;
      const filters = req.query;
      const report = await this.service.generateReport(type, filters);
      
      res.json({
        success: true,
        data: report
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Error interno del servidor"
      });
    }
  }

  /**
   * Obtener tipos de reportes disponibles
   * GET /api/maintenance/reports
   */
  async getReportTypes(req: Request, res: Response): Promise<void> {
    try {
      const types = this.service.getReportTypes();
      
      res.json({
        success: true,
        data: types
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Error interno del servidor"
      });
    }
  }

  /**
   * Crear registro de mantenimiento con integración automática
   * POST /api/maintenance/integrated/logs
   */
  async createIntegratedLog(req: Request, res: Response): Promise<void> {
    try {
      const { vehicleId, ...logData } = req.body;
      const { createMaintenanceLogWithIntegration } = await import("../../services/maintenanceIntegrationService.js");
      
      const result = await createMaintenanceLogWithIntegration(vehicleId, logData);
      
      res.status(201).json({
        success: true,
        data: result,
        message: result.message
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Error interno del servidor"
      });
    }
  }

  /**
   * Cerrar orden con integración automática
   * PATCH /api/maintenance/integrated/orders/:orderId/close
   */
  async closeIntegratedOrder(req: Request, res: Response): Promise<void> {
    try {
      const { orderId } = req.params;
      const closeData = { orderId, ...req.body };
      const { closeMaintenanceOrderWithIntegration } = await import("../../services/maintenanceIntegrationService.js");
      
      const result = await closeMaintenanceOrderWithIntegration(closeData);
      
      res.json({
        success: true,
        data: result,
        message: result.message
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Error interno del servidor"
      });
    }
  }

  /**
   * Obtener historial integrado de mantenimiento
   * GET /api/maintenance/integrated/history/:vehicleId
   */
  async getIntegratedHistory(req: Request, res: Response): Promise<void> {
    try {
      const { vehicleId } = req.params;
      const { getIntegratedMaintenanceHistory } = await import("../../services/maintenanceIntegrationService.js");
      
      const history = await getIntegratedMaintenanceHistory(vehicleId);
      
      res.json({
        success: true,
        data: history
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Error interno del servidor"
      });
    }
  }

  /**
   * Obtener estadísticas de mantenimiento integrado
   * GET /api/maintenance/integrated/statistics/:vehicleId
   */
  async getIntegratedStatistics(req: Request, res: Response): Promise<void> {
    try {
      const { vehicleId } = req.params;
      const { getMaintenanceStatistics } = await import("../../services/maintenanceIntegrationService.js");
      
      const statistics = await getMaintenanceStatistics(vehicleId);
      
      res.json({
        success: true,
        data: statistics
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Error interno del servidor"
      });
    }
  }

  /**
   * Obtener el router configurado para el módulo
   */
  getRouter(): Router {
    const router = Router();

    // Rutas CRUD básicas
    router.post("/", this.create.bind(this));
    router.get("/", this.getAll.bind(this));
    router.get("/:id", this.getById.bind(this));
    router.put("/:id", this.update.bind(this));
    router.delete("/:id", this.delete.bind(this));

    // Rutas para órdenes de mantenimiento
    router.post("/orders", this.createOrder.bind(this));
    router.get("/orders/vehicle/:vehicleId", this.getOrdersByVehicle.bind(this));

    // Rutas para logs de mantenimiento
    router.post("/logs", this.createLog.bind(this));
    router.get("/logs/vehicle/:vehicleId", this.getLogsByVehicle.bind(this));

    // Rutas integradas (nuevas)
    router.post("/integrated/logs", this.createIntegratedLog.bind(this));
    router.patch("/integrated/orders/:orderId/close", this.closeIntegratedOrder.bind(this));
    router.get("/integrated/history/:vehicleId", this.getIntegratedHistory.bind(this));
    router.get("/integrated/statistics/:vehicleId", this.getIntegratedStatistics.bind(this));

    // Rutas para reportes
    router.get("/reports", this.getReportTypes.bind(this));
    router.get("/reports/:type", this.generateReport.bind(this));

    return router;
  }
}