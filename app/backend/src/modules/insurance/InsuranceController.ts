import { Request, Response, Router } from "express";
import { IModuleController } from "../../core/interfaces/IModule.js";
import { InsuranceService } from "./InsuranceService.js";

/**
 * Controlador del módulo de Seguros
 * Maneja las peticiones HTTP para operaciones de seguros
 */
export class InsuranceController implements IModuleController {
  private service: InsuranceService;

  constructor(service: InsuranceService) {
    this.service = service;
  }

  /**
   * Inicializar el controlador
   */
  async initialize(): Promise<void> {
    console.log("Inicializando controlador de Seguros...");
  }

  /**
   * Limpiar recursos del controlador
   */
  async cleanup(): Promise<void> {
    console.log("Limpiando recursos del controlador de Seguros...");
  }

  // ==================== OPERACIONES CRUD ====================

  /**
   * Crear un nuevo registro de seguro
   */
  async create(req: Request, res: Response): Promise<void> {
    try {
      const payload = req.body;
      
      // Validaciones básicas
      if (!payload.vehicleId || !payload.provider || !payload.policyNumber) {
        res.status(400).json({
          error: "Faltan campos requeridos: vehicleId, provider, policyNumber"
        });
        return;
      }

      const result = await this.service.create(payload);
      res.status(201).json(result);
    } catch (error) {
      console.error("Error al crear seguro:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  /**
   * Obtener un registro de seguro por ID
   */
  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const result = await this.service.getById(id);
      
      if (!result) {
        res.status(404).json({ error: "Seguro no encontrado" });
        return;
      }
      
      res.json(result);
    } catch (error) {
      console.error("Error al obtener seguro:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  /**
   * Obtener todos los registros de seguro
   */
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const filters = req.query;
      const results = await this.service.getAll(filters);
      res.json(results);
    } catch (error) {
      console.error("Error al obtener seguros:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  /**
   * Actualizar un registro de seguro
   */
  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const payload = req.body;
      
      const result = await this.service.update(id, payload);
      res.json(result);
    } catch (error) {
      console.error("Error al actualizar seguro:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  /**
   * Eliminar un registro de seguro
   */
  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const success = await this.service.delete(id);
      
      if (!success) {
        res.status(404).json({ error: "Seguro no encontrado" });
        return;
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Error al eliminar seguro:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  // ==================== OPERACIONES ESPECÍFICAS DEL MÓDULO ====================

  /**
   * Crear una nueva póliza de seguro
   */
  async createPolicy(req: Request, res: Response): Promise<void> {
    try {
      const payload = req.body;
      const result = await this.service.createPolicy(payload);
      res.status(201).json(result);
    } catch (error) {
      console.error("Error al crear póliza:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  /**
   * Obtener todas las pólizas
   */
  async getAllPolicies(req: Request, res: Response): Promise<void> {
    try {
      const filters = req.query;
      const results = await this.service.getAllPolicies(filters);
      res.json(results);
    } catch (error) {
      console.error("Error al obtener pólizas:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  /**
   * Obtener una póliza por ID
   */
  async getPolicyById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const result = await this.service.getPolicyById(id);
      
      if (!result) {
        res.status(404).json({ error: "Póliza no encontrada" });
        return;
      }
      
      res.json(result);
    } catch (error) {
      console.error("Error al obtener póliza:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  /**
   * Asignar vehículos a una póliza
   */
  async assignVehiclesToPolicy(req: Request, res: Response): Promise<void> {
    try {
      const { policyId } = req.params;
      const { vehicleIds } = req.body;
      
      if (!Array.isArray(vehicleIds)) {
        res.status(400).json({ error: "vehicleIds debe ser un array" });
        return;
      }
      
      const result = await this.service.assignVehiclesToPolicy(policyId, vehicleIds);
      res.json(result);
    } catch (error) {
      console.error("Error al asignar vehículos a póliza:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  /**
   * Renovar una póliza
   */
  async renewPolicy(req: Request, res: Response): Promise<void> {
    try {
      const { policyId } = req.params;
      const payload = req.body;
      
      const result = await this.service.renewPolicy(policyId, payload);
      res.json(result);
    } catch (error) {
      console.error("Error al renovar póliza:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  // ==================== OPERACIONES DE REPORTES ====================

  /**
   * Generar reportes de seguros
   */
  async generateReport(req: Request, res: Response): Promise<void> {
    try {
      const { type } = req.params;
      const filters = req.query;
      
      const result = await this.service.generateReport(type, filters);
      res.json(result);
    } catch (error) {
      console.error("Error al generar reporte:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  /**
   * Obtener tipos de reportes disponibles
   */
  async getReportTypes(req: Request, res: Response): Promise<void> {
    try {
      const types = this.service.getReportTypes();
      res.json({ reportTypes: types });
    } catch (error) {
      console.error("Error al obtener tipos de reportes:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  // ==================== MÉTODOS AUXILIARES ====================

  /**
   * Verificar pólizas próximas a vencer
   */
  async checkExpiringPolicies(req: Request, res: Response): Promise<void> {
    try {
      const days = parseInt(req.query.days as string) || 30;
      const result = await this.service.checkExpiringPolicies(days);
      res.json(result);
    } catch (error) {
      console.error("Error al verificar pólizas próximas a vencer:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  /**
   * Calcular costo de seguros por vehículo
   */
  async calculateCostByVehicle(req: Request, res: Response): Promise<void> {
    try {
      const { vehicleId } = req.params;
      const result = await this.service.calculateInsuranceCostByVehicle(vehicleId);
      res.json({ vehicleId, totalCost: result });
    } catch (error) {
      console.error("Error al calcular costo por vehículo:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  // ==================== CONFIGURACIÓN DE RUTAS ====================

  /**
   * Obtener el router configurado con todas las rutas
   */
  getRouter(): Router {
    const router = Router();

    // Rutas CRUD básicas para seguros
    router.post("/", this.create.bind(this));
    router.get("/", this.getAll.bind(this));
    router.get("/:id", this.getById.bind(this));
    router.put("/:id", this.update.bind(this));
    router.delete("/:id", this.delete.bind(this));

    // Rutas para pólizas
    router.post("/policies", this.createPolicy.bind(this));
    router.get("/policies", this.getAllPolicies.bind(this));
    router.get("/policies/:id", this.getPolicyById.bind(this));
    router.post("/policies/:policyId/assign-vehicles", this.assignVehiclesToPolicy.bind(this));
    router.post("/policies/:policyId/renew", this.renewPolicy.bind(this));

    // Rutas para reportes
    router.get("/reports/types", this.getReportTypes.bind(this));
    router.get("/reports/:type", this.generateReport.bind(this));

    // Rutas auxiliares
    router.get("/expiring-policies", this.checkExpiringPolicies.bind(this));
    router.get("/cost/:vehicleId", this.calculateCostByVehicle.bind(this));

    return router;
  }
}