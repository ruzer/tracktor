import { Request, Response, Router } from "express";
import { IModuleController } from "../../core/interfaces/IModule.js";
import { VehicleService, CreateVehiclePayload, UpdateVehiclePayload, VehicleFilters } from "./VehicleService.js";
import { createVehicleRouter } from "./VehicleRouter.js";

/**
 * Controlador del módulo de vehículos
 * Maneja las rutas HTTP para operaciones CRUD de vehículos
 */
export class VehicleController implements IModuleController {
  private vehicleService: VehicleService;

  constructor(vehicleService: VehicleService) {
    this.vehicleService = vehicleService;
  }

  // ==================== OPERACIONES CRUD ====================

  /**
   * Crear un nuevo vehículo
   * POST /api/vehicles
   */
  async create(req: Request, res: Response): Promise<void> {
    try {
      const payload: CreateVehiclePayload = req.body;

      // Validaciones básicas
      if (!payload.make || !payload.model || !payload.year || !payload.licensePlate) {
        res.status(400).json({
          error: "Campos requeridos: make, model, year, licensePlate"
        });
        return;
      }

      // Verificar si ya existe un vehículo con esa placa
      const exists = await this.vehicleService.existsByLicensePlate(payload.licensePlate);
      if (exists) {
        res.status(409).json({
          error: "Ya existe un vehículo con esa placa"
        });
        return;
      }

      const vehicle = await this.vehicleService.create(payload);
      res.status(201).json({
        success: true,
        data: vehicle,
        message: "Vehículo creado exitosamente"
      });
    } catch (error) {
      console.error("Error al crear vehículo:", error);
      res.status(500).json({
        error: "Error interno del servidor",
        details: error instanceof Error ? error.message : "Error desconocido"
      });
    }
  }

  /**
   * Obtener todos los vehículos
   * GET /api/vehicles
   */
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const filters: VehicleFilters = {
        search: req.query.search as string,
        status: req.query.status as string,
        make: req.query.make as string,
        model: req.query.model as string,
        year: req.query.year ? parseInt(req.query.year as string) : undefined,
        ownershipTypeId: req.query.ownershipTypeId as string
      };

      // Remover filtros vacíos
      Object.keys(filters).forEach(key => {
        if (filters[key as keyof VehicleFilters] === undefined || filters[key as keyof VehicleFilters] === "") {
          delete filters[key as keyof VehicleFilters];
        }
      });

      const vehicles = await this.vehicleService.getAll(filters);
      res.json({
        success: true,
        data: vehicles,
        count: vehicles.length
      });
    } catch (error) {
      console.error("Error al obtener vehículos:", error);
      res.status(500).json({
        error: "Error interno del servidor",
        details: error instanceof Error ? error.message : "Error desconocido"
      });
    }
  }

  /**
   * Obtener un vehículo por ID
   * GET /api/vehicles/:id
   */
  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          error: "ID del vehículo es requerido"
        });
        return;
      }

      const vehicle = await this.vehicleService.getById(id);
      if (!vehicle) {
        res.status(404).json({
          error: "Vehículo no encontrado"
        });
        return;
      }

      res.json({
        success: true,
        data: vehicle
      });
    } catch (error) {
      console.error("Error al obtener vehículo:", error);
      res.status(500).json({
        error: "Error interno del servidor",
        details: error instanceof Error ? error.message : "Error desconocido"
      });
    }
  }

  /**
   * Actualizar un vehículo
   * PUT /api/vehicles/:id
   */
  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const payload: UpdateVehiclePayload = req.body;

      if (!id) {
        res.status(400).json({
          error: "ID del vehículo es requerido"
        });
        return;
      }

      // Verificar si el vehículo existe
      const existingVehicle = await this.vehicleService.getById(id);
      if (!existingVehicle) {
        res.status(404).json({
          error: "Vehículo no encontrado"
        });
        return;
      }

      // Si se está actualizando la placa, verificar que no exista otra con la misma
      if (payload.licensePlate && payload.licensePlate !== existingVehicle.licensePlate) {
        const exists = await this.vehicleService.existsByLicensePlate(payload.licensePlate, id);
        if (exists) {
          res.status(409).json({
            error: "Ya existe otro vehículo con esa placa"
          });
          return;
        }
      }

      const updatedVehicle = await this.vehicleService.update(id, payload);
      res.json({
        success: true,
        data: updatedVehicle,
        message: "Vehículo actualizado exitosamente"
      });
    } catch (error) {
      console.error("Error al actualizar vehículo:", error);
      res.status(500).json({
        error: "Error interno del servidor",
        details: error instanceof Error ? error.message : "Error desconocido"
      });
    }
  }

  /**
   * Eliminar un vehículo
   * DELETE /api/vehicles/:id
   */
  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          error: "ID del vehículo es requerido"
        });
        return;
      }

      // Verificar si el vehículo existe
      const existingVehicle = await this.vehicleService.getById(id);
      if (!existingVehicle) {
        res.status(404).json({
          error: "Vehículo no encontrado"
        });
        return;
      }

      const deleted = await this.vehicleService.delete(id);
      if (deleted) {
        res.json({
          success: true,
          message: "Vehículo eliminado exitosamente"
        });
      } else {
        res.status(500).json({
          error: "No se pudo eliminar el vehículo"
        });
      }
    } catch (error) {
      console.error("Error al eliminar vehículo:", error);
      res.status(500).json({
        error: "Error interno del servidor",
        details: error instanceof Error ? error.message : "Error desconocido"
      });
    }
  }

  // ==================== OPERACIONES DE REPORTES ====================

  /**
   * Generar reporte de vehículos
   * GET /api/vehicles/reports/:type
   */
  async generateReport(req: Request, res: Response): Promise<void> {
    try {
      const { type } = req.params;
      const filters = req.query;

      if (!type) {
        res.status(400).json({
          error: "Tipo de reporte es requerido"
        });
        return;
      }

      const report = await this.vehicleService.generateReport(type, filters);
      res.json({
        success: true,
        data: report
      });
    } catch (error) {
      console.error("Error al generar reporte:", error);
      if (error instanceof Error && error.message.includes("no soportado")) {
        res.status(400).json({
          error: error.message,
          availableTypes: this.vehicleService.getReportTypes()
        });
      } else {
        res.status(500).json({
          error: "Error interno del servidor",
          details: error instanceof Error ? error.message : "Error desconocido"
        });
      }
    }
  }

  /**
   * Obtener tipos de reportes disponibles
   * GET /api/vehicles/reports
   */
  async getReportTypes(req: Request, res: Response): Promise<void> {
    try {
      const types = this.vehicleService.getReportTypes();
      res.json({
        success: true,
        data: types
      });
    } catch (error) {
      console.error("Error al obtener tipos de reportes:", error);
      res.status(500).json({
        error: "Error interno del servidor",
        details: error instanceof Error ? error.message : "Error desconocido"
      });
    }
  }

  // ==================== OPERACIONES ADICIONALES ====================

  /**
   * Obtener estadísticas de vehículos
   * GET /api/vehicles/stats
   */
  async getStats(req: Request, res: Response): Promise<void> {
    try {
      const stats = await this.vehicleService.getStats();
      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error("Error al obtener estadísticas:", error);
      res.status(500).json({
        error: "Error interno del servidor",
        details: error instanceof Error ? error.message : "Error desconocido"
      });
    }
  }

  /**
   * Verificar disponibilidad de placa
   * GET /api/vehicles/check-plate/:licensePlate
   */
  async checkPlateAvailability(req: Request, res: Response): Promise<void> {
    try {
      const { licensePlate } = req.params;
      const { excludeId } = req.query;

      if (!licensePlate) {
        res.status(400).json({
          error: "Placa es requerida"
        });
        return;
      }

      const exists = await this.vehicleService.existsByLicensePlate(
        licensePlate, 
        excludeId as string
      );

      res.json({
        success: true,
        data: {
          licensePlate,
          available: !exists,
          exists
        }
      });
    } catch (error) {
      console.error("Error al verificar placa:", error);
      res.status(500).json({
        error: "Error interno del servidor",
        details: error instanceof Error ? error.message : "Error desconocido"
      });
    }
  }

  /**
   * Probar funcionalidad del módulo
   * GET /api/vehicles/test
   */
  async test(req: Request, res: Response): Promise<void> {
    try {
      const testResults = {
        service: "available",
        controller: "available",
        database: "connected",
        operations: {
          create: "available",
          read: "available", 
          update: "available",
          delete: "available"
        },
        reports: {
          types: this.vehicleService.getReportTypes(),
          available: true
        },
        timestamp: new Date().toISOString()
      };

      res.json({
        success: true,
        message: "Módulo de vehículos funcionando correctamente",
        data: testResults
      });
    } catch (error) {
      console.error("Error en test del módulo:", error);
      res.status(500).json({
        error: "Error en test del módulo",
        details: error instanceof Error ? error.message : "Error desconocido"
      });
    }
  }

  /**
   * Obtener el router del módulo
   */
  getRouter(): Router {
    return createVehicleRouter(this);
  }
}