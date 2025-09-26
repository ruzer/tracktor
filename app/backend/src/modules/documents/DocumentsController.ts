import { Request, Response, Router } from "express";
import { IModuleController } from "../../core/interfaces/IModule.js";
import { DocumentsService } from "./DocumentsService.js";

/**
 * Controlador para el módulo de documentos
 */
export class DocumentsController implements IModuleController {
  private service: DocumentsService;
  private router: Router;

  constructor(service: DocumentsService) {
    this.service = service;
    this.router = Router();
    this.setupRoutes();
  }

  /**
   * Configura las rutas del controlador
   */
  private setupRoutes(): void {
    // Rutas de test y estado
    this.router.get("/test", this.test.bind(this));
    this.router.get("/status", this.getModuleStatus.bind(this));
    this.router.get("/reports", this.getReportTypes.bind(this));

    // Rutas PUCC
    this.router.post("/pucc", this.createPUCC.bind(this));
    this.router.get("/pucc/:id", this.getPUCCById.bind(this));
    this.router.get("/vehicle/:vehicleId/pucc", this.getPUCCByVehicle.bind(this));
    this.router.put("/pucc/:id", this.updatePUCC.bind(this));
    this.router.delete("/pucc/:id", this.deletePUCC.bind(this));

    // Rutas de impuestos
    this.router.post("/taxes", this.createTax.bind(this));
    this.router.get("/taxes/:id", this.getTaxById.bind(this));
    this.router.get("/vehicle/:vehicleId/taxes", this.getTaxesByVehicle.bind(this));
    this.router.put("/taxes/:id", this.updateTax.bind(this));
    this.router.patch("/taxes/:id/pay", this.markTaxAsPaid.bind(this));
    this.router.delete("/taxes/:id", this.deleteTax.bind(this));

    // Rutas de documentos
    this.router.post("/documents", this.createDocument.bind(this));
    this.router.get("/documents/:id", this.getDocumentById.bind(this));
    this.router.get("/vehicle/:vehicleId/documents", this.getDocumentsByVehicle.bind(this));
    this.router.put("/documents/:id", this.updateDocument.bind(this));
    this.router.delete("/documents/:id", this.deleteDocument.bind(this));

    // Rutas de reportes
    this.router.get("/reports/:type", this.generateReport.bind(this));
  }

  /**
   * Obtiene el router del controlador
   */
  getRouter(): Router {
    return this.router;
  }

  // ==================== RUTAS DE TEST Y ESTADO ====================

  /**
   * Endpoint de prueba
   */
  async test(req: Request, res: Response): Promise<void> {
    try {
      res.json({
        module: "DocumentsModule",
        status: "working",
        timestamp: new Date().toISOString(),
        service: this.service.getStatus(),
        features: {
          pucc: "available",
          taxes: "available", 
          documents: "available",
          reports: "available"
        }
      });
    } catch {
      res.status(500).json({ error: "Error en test del módulo" });
    }
  }

  /**
   * Estado del módulo
   */
  async getModuleStatus(req: Request, res: Response): Promise<void> {
    try {
      res.json(this.service.getStatus());
    } catch {
      res.status(500).json({ error: "Error obteniendo estado del módulo" });
    }
  }

  /**
   * Tipos de reportes disponibles
   */
  async getReportTypes(req: Request, res: Response): Promise<void> {
    try {
      res.json({
        reportTypes: this.service.getReportTypes()
      });
    } catch {
      res.status(500).json({ error: "Error obteniendo tipos de reportes" });
    }
  }

  // ==================== RUTAS PUCC ====================

  /**
   * Crear certificado PUCC
   */
  async createPUCC(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.service.createPUCC(req.body);
      res.status(201).json(result);
    } catch {
      res.status(500).json({ error: "Error creando certificado PUCC" });
    }
  }

  /**
   * Obtener PUCC por ID
   */
  async getPUCCById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const result = await this.service.getPUCCById(id);
      
      if (!result) {
        res.status(404).json({ error: "Certificado PUCC no encontrado" });
        return;
      }
      
      res.json(result);
    } catch {
      res.status(500).json({ error: "Error obteniendo certificado PUCC" });
    }
  }

  /**
   * Obtener PUCC por vehículo
   */
  async getPUCCByVehicle(req: Request, res: Response): Promise<void> {
    try {
      const { vehicleId } = req.params;
      const result = await this.service.getPUCCByVehicle(vehicleId);
      res.json(result);
    } catch {
      res.status(500).json({ error: "Error obteniendo certificados PUCC del vehículo" });
    }
  }

  /**
   * Actualizar PUCC
   */
  async updatePUCC(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const result = await this.service.updatePUCC(id, req.body);
      res.json(result);
    } catch {
      res.status(500).json({ error: "Error actualizando certificado PUCC" });
    }
  }

  /**
   * Eliminar PUCC
   */
  async deletePUCC(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const success = await this.service.deletePUCC(id);
      
      if (!success) {
        res.status(404).json({ error: "Certificado PUCC no encontrado" });
        return;
      }
      
      res.json({ message: "Certificado PUCC eliminado correctamente" });
    } catch {
      res.status(500).json({ error: "Error eliminando certificado PUCC" });
    }
  }

  // ==================== RUTAS IMPUESTOS ====================

  /**
   * Crear impuesto
   */
  async createTax(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.service.createTax(req.body);
      res.status(201).json(result);
    } catch {
      res.status(500).json({ error: "Error creando impuesto" });
    }
  }

  /**
   * Obtener impuesto por ID
   */
  async getTaxById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const result = await this.service.getTaxById(id);
      
      if (!result) {
        res.status(404).json({ error: "Impuesto no encontrado" });
        return;
      }
      
      res.json(result);
    } catch {
      res.status(500).json({ error: "Error obteniendo impuesto" });
    }
  }

  /**
   * Obtener impuestos por vehículo
   */
  async getTaxesByVehicle(req: Request, res: Response): Promise<void> {
    try {
      const { vehicleId } = req.params;
      const result = await this.service.getTaxesByVehicle(vehicleId);
      res.json(result);
    } catch {
      res.status(500).json({ error: "Error obteniendo impuestos del vehículo" });
    }
  }

  /**
   * Actualizar impuesto
   */
  async updateTax(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const result = await this.service.updateTax(id, req.body);
      res.json(result);
    } catch {
      res.status(500).json({ error: "Error actualizando impuesto" });
    }
  }

  /**
   * Marcar impuesto como pagado
   */
  async markTaxAsPaid(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { paidDate } = req.body;
      const result = await this.service.markTaxAsPaid(id, paidDate);
      res.json(result);
    } catch {
      res.status(500).json({ error: "Error marcando impuesto como pagado" });
    }
  }

  /**
   * Eliminar impuesto
   */
  async deleteTax(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const success = await this.service.deleteTax(id);
      
      if (!success) {
        res.status(404).json({ error: "Impuesto no encontrado" });
        return;
      }
      
      res.json({ message: "Impuesto eliminado correctamente" });
    } catch {
      res.status(500).json({ error: "Error eliminando impuesto" });
    }
  }

  // ==================== RUTAS DOCUMENTOS ====================

  /**
   * Crear documento
   */
  async createDocument(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.service.createDocument(req.body);
      res.status(201).json(result);
    } catch {
      res.status(500).json({ error: "Error creando documento" });
    }
  }

  /**
   * Obtener documento por ID
   */
  async getDocumentById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const result = await this.service.getDocumentById(id);
      
      if (!result) {
        res.status(404).json({ error: "Documento no encontrado" });
        return;
      }
      
      res.json(result);
    } catch {
      res.status(500).json({ error: "Error obteniendo documento" });
    }
  }

  /**
   * Obtener documentos por vehículo
   */
  async getDocumentsByVehicle(req: Request, res: Response): Promise<void> {
    try {
      const { vehicleId } = req.params;
      const result = await this.service.getDocumentsByVehicle(vehicleId);
      res.json(result);
    } catch {
      res.status(500).json({ error: "Error obteniendo documentos del vehículo" });
    }
  }

  /**
   * Actualizar documento
   */
  async updateDocument(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const result = await this.service.updateDocument(id, req.body);
      res.json(result);
    } catch {
      res.status(500).json({ error: "Error actualizando documento" });
    }
  }

  /**
   * Eliminar documento
   */
  async deleteDocument(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const success = await this.service.deleteDocument(id);
      
      if (!success) {
        res.status(404).json({ error: "Documento no encontrado" });
        return;
      }
      
      res.json({ message: "Documento eliminado correctamente" });
    } catch {
      res.status(500).json({ error: "Error eliminando documento" });
    }
  }

  // ==================== IMPLEMENTACIÓN DE INTERFAZ ====================

  async create(req: Request, res: Response): Promise<void> {
    res.status(400).json({ 
      error: "Use endpoints específicos: /pucc, /taxes, /documents" 
    });
  }

  async getById(req: Request, res: Response): Promise<void> {
    res.status(400).json({ 
      error: "Use endpoints específicos: /pucc/:id, /taxes/:id, /documents/:id" 
    });
  }

  async getAll(req: Request, res: Response): Promise<void> {
    res.status(400).json({ 
      error: "Use endpoints específicos por vehículo: /vehicle/:vehicleId/pucc, /vehicle/:vehicleId/taxes, /vehicle/:vehicleId/documents" 
    });
  }

  async update(req: Request, res: Response): Promise<void> {
    res.status(400).json({ 
      error: "Use endpoints específicos: PUT /pucc/:id, PUT /taxes/:id, PUT /documents/:id" 
    });
  }

  async delete(req: Request, res: Response): Promise<void> {
    res.status(400).json({ 
      error: "Use endpoints específicos: DELETE /pucc/:id, DELETE /taxes/:id, DELETE /documents/:id" 
    });
  }

  async generateReport(req: Request, res: Response): Promise<void> {
    try {
      const { type } = req.params;
      const filters = req.query;
      const result = await this.service.generateReport(type, filters as Record<string, any>);
      res.json(result);
    } catch {
      res.status(500).json({ error: "Error generando reporte" });
    }
  }

  /**
   * Obtiene el estado del controlador
   */
  getStatus() {
    return {
      routes: {
        pucc: "available",
        taxes: "available",
        documents: "available",
        reports: "available"
      },
      endpoints: [
        "GET /test",
        "GET /status", 
        "GET /reports",
        "POST /pucc",
        "GET /pucc/:id",
        "GET /vehicle/:vehicleId/pucc",
        "PUT /pucc/:id",
        "DELETE /pucc/:id",
        "POST /taxes",
        "GET /taxes/:id",
        "GET /vehicle/:vehicleId/taxes",
        "PUT /taxes/:id",
        "PATCH /taxes/:id/pay",
        "DELETE /taxes/:id",
        "POST /documents",
        "GET /documents/:id",
        "GET /vehicle/:vehicleId/documents",
        "PUT /documents/:id",
        "DELETE /documents/:id",
        "GET /reports/:type"
      ]
    };
  }
}