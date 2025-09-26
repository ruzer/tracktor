import { Request, Response } from 'express';
import { AssignmentService } from './AssignmentService.js';
import { assignmentRoutes } from './AssignmentRouter.js';
import { IModuleController } from "../../core/interfaces/IModule.js";

export class AssignmentController implements IModuleController {
  constructor(private service: AssignmentService) {}

  getRouter() {
    return assignmentRoutes(this);
  }

  // Endpoint de prueba
  async test(req: Request, res: Response): Promise<void> {
    try {
      res.json({
        message: 'AssignmentModule is working',
        service: this.service.getStatus(),
        features: {
          assignments: 'available',
          reports: 'available'
        }
      });
    } catch {
      res.status(500).json({ error: 'Error en el módulo de asignaciones' });
    }
  }

  // Estado del módulo
  async getStatus(req: Request, res: Response): Promise<void> {
    try {
      const status = this.service.getStatus();
      res.json(status);
    } catch {
      res.status(500).json({ error: 'Error obteniendo estado del módulo' });
    }
  }

  // Reportes disponibles
  async getReports(req: Request, res: Response): Promise<void> {
    try {
      res.json({
        reports: [
          'assignment-summary',
          'current-assignments', 
          'assignment-history'
        ]
      });
    } catch {
      res.status(500).json({ error: 'Error obteniendo reportes disponibles' });
    }
  }

  // Obtener asignaciones por vehículo
  async getAssignmentsByVehicle(req: Request, res: Response): Promise<void> {
    try {
      const { vehicleId } = req.params;
      const assignments = await this.service.getAssignmentsByVehicle(vehicleId);
      res.json(assignments);
    } catch (error) {
      console.error('Error in getAssignmentsByVehicle:', error);
      res.status(500).json({ error: 'Error obteniendo asignaciones del vehículo' });
    }
  }

  // Crear nueva asignación
  async createAssignment(req: Request, res: Response): Promise<void> {
    try {
      const { vehicleId } = req.params;
      const result = await this.service.createAssignment(vehicleId, req.body);
      res.status(201).json(result);
    } catch (error) {
      console.error('Error in createAssignment:', error);
      res.status(500).json({ error: 'Error creando asignación' });
    }
  }

  // Cerrar asignación
  async closeAssignment(req: Request, res: Response): Promise<void> {
    try {
      const { vehicleId, assignmentId } = req.params;
      const { endDate } = req.body;
      const result = await this.service.closeAssignment(vehicleId, assignmentId, endDate);
      res.json(result);
    } catch {
      res.status(500).json({ error: 'Error cerrando asignación' });
    }
  }

  // Generar reporte de resumen de asignaciones
  async generateAssignmentSummaryReport(req: Request, res: Response): Promise<void> {
    try {
      const report = await this.service.generateAssignmentSummaryReport(req.query);
      res.json(report);
    } catch {
      res.status(500).json({ error: 'Error generando reporte de resumen' });
    }
  }

  // Generar reporte de asignaciones actuales
  async generateCurrentAssignmentsReport(req: Request, res: Response): Promise<void> {
    try {
      const report = await this.service.generateCurrentAssignmentsReport(req.query);
      res.json(report);
    } catch {
      res.status(500).json({ error: 'Error generando reporte de asignaciones actuales' });
    }
  }

  // Generar reporte de historial de asignaciones
  async generateAssignmentHistoryReport(req: Request, res: Response): Promise<void> {
    try {
      const report = await this.service.generateAssignmentHistoryReport(req.query);
      res.json(report);
    } catch {
      res.status(500).json({ error: 'Error generando reporte de historial' });
    }
  }

  // Métodos requeridos por IModuleController
  async create(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.service.create(req.body);
      res.status(201).json(result);
    } catch {
      res.status(500).json({ error: 'Error creando asignación' });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.service.getById(req.params.id);
      if (!result) {
        res.status(404).json({ error: 'Asignación no encontrada' });
        return;
      }
      res.json(result);
    } catch {
      res.status(500).json({ error: 'Error obteniendo asignación' });
    }
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.service.getAll(req.query);
      res.json(result);
    } catch {
      res.status(500).json({ error: 'Error obteniendo asignaciones' });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.service.update(req.params.id, req.body);
      res.json(result);
    } catch {
      res.status(500).json({ error: 'Error actualizando asignación' });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.service.delete(req.params.id);
      res.json({ success: result });
    } catch {
      res.status(500).json({ error: 'Error eliminando asignación' });
    }
  }

  async generateReport(req: Request, res: Response): Promise<void> {
    try {
      const { type } = req.params;
      const result = await this.service.generateReport(type, req.query);
      res.json(result);
    } catch {
      res.status(500).json({ error: 'Error generando reporte' });
    }
  }
}