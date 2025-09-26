import { listAssignments, addAssignment, closeAssignment } from '../../services/vehicleAssignmentService.js';
import { IModuleService } from '../../core/interfaces/IModule.js';

// Interfaces para el módulo de asignaciones
export interface AssignmentRecord {
  id: string;
  vehicleId: string;
  assigneeName?: string;
  assigneeRole?: string;
  area?: string;
  unit?: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAssignmentPayload {
  vehicleId: string;
  assigneeName?: string;
  assigneeRole?: string;
  area?: string;
  unit?: string;
  startDate: string;
  isCurrent?: boolean;
  endDate?: string;
  notes?: string;
}

export interface UpdateAssignmentPayload {
  assigneeName?: string;
  assigneeRole?: string;
  area?: string;
  unit?: string;
  endDate?: string;
  notes?: string;
}

export interface AssignmentFilters {
  vehicleId?: string;
  assigneeName?: string;
  area?: string;
  unit?: string;
  isCurrent?: boolean;
  startDate?: string;
  endDate?: string;
}

export class AssignmentService implements IModuleService<AssignmentRecord, CreateAssignmentPayload, UpdateAssignmentPayload> {
  async initialize(): Promise<void> {
    // El servicio de asignaciones ya está inicializado a través del sistema de base de datos
    console.log('AssignmentService initialized');
  }

  async cleanup(): Promise<void> {
    // No hay recursos específicos que limpiar
    console.log('AssignmentService cleaned up');
  }

  getStatus(): any {
    return {
      database: 'connected',
      operations: {
        list: 'available',
        create: 'available',
        close: 'available',
        reports: 'available'
      }
    };
  }

  // Operaciones CRUD para asignaciones
  async getAssignmentsByVehicle(vehicleId: string): Promise<AssignmentRecord[]> {
    const assignments = await listAssignments(vehicleId);
    return assignments.map(assignment => ({
      id: assignment.id,
      vehicleId: assignment.vehicleId,
      assigneeName: assignment.assigneeName || undefined,
      assigneeRole: assignment.assigneeRole || undefined,
      area: assignment.area || undefined,
      unit: assignment.unit || undefined,
      startDate: assignment.startDate,
      endDate: assignment.endDate || undefined,
      isCurrent: assignment.isCurrent,
      notes: assignment.notes || undefined,
      createdAt: assignment.created_at,
      updatedAt: assignment.updated_at
    }));
  }

  // Métodos requeridos por IModuleService
  async create(payload: CreateAssignmentPayload): Promise<AssignmentRecord> {
    const result = await addAssignment(payload.vehicleId, payload);
    // Convertir el resultado al formato AssignmentRecord
    return {
      id: result.id,
      vehicleId: payload.vehicleId,
      assigneeName: payload.assigneeName,
      assigneeRole: payload.assigneeRole,
      area: payload.area,
      unit: payload.unit,
      startDate: payload.startDate,
      endDate: payload.endDate,
      isCurrent: payload.isCurrent ?? true,
      notes: payload.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  async getById(id: string): Promise<AssignmentRecord | null> {
    // Implementación básica - buscar en todas las asignaciones
    const allAssignments = await listAssignments('');
    const assignment = allAssignments.find(a => a.id === id);
    if (!assignment) return null;
    
    return {
      id: assignment.id,
      vehicleId: assignment.vehicleId,
      assigneeName: assignment.assigneeName || undefined,
      assigneeRole: assignment.assigneeRole || undefined,
      area: assignment.area || undefined,
      unit: assignment.unit || undefined,
      startDate: assignment.startDate,
      endDate: assignment.endDate || undefined,
      isCurrent: assignment.isCurrent,
      notes: assignment.notes || undefined,
      createdAt: assignment.created_at,
      updatedAt: assignment.updated_at
    };
  }

  async getAll(filters?: Record<string, any>): Promise<AssignmentRecord[]> {
    const vehicleId = filters?.vehicleId;
    if (vehicleId) {
      return this.getAssignmentsByVehicle(vehicleId);
    }
    
    const assignments = await listAssignments('');
    return assignments.map(assignment => ({
      id: assignment.id,
      vehicleId: assignment.vehicleId,
      assigneeName: assignment.assigneeName || undefined,
      assigneeRole: assignment.assigneeRole || undefined,
      area: assignment.area || undefined,
      unit: assignment.unit || undefined,
      startDate: assignment.startDate,
      endDate: assignment.endDate || undefined,
      isCurrent: assignment.isCurrent,
      notes: assignment.notes || undefined,
      createdAt: assignment.created_at,
      updatedAt: assignment.updated_at
    }));
  }

  async update(_id: string, _payload: UpdateAssignmentPayload): Promise<AssignmentRecord> {
    // Para actualizar, necesitamos cerrar la asignación actual y crear una nueva
    // Esta es una implementación simplificada
    throw new Error('Update assignment not implemented yet');
  }

  async delete(id: string): Promise<boolean> {
    // Para eliminar, cerramos la asignación
    const assignment = await this.getById(id);
    if (!assignment) return false;
    
    await closeAssignment(assignment.vehicleId, id);
    return true;
  }

  generateReport(type: string, filters?: Record<string, any>): Promise<any> {
    switch (type) {
      case 'summary':
        return this.generateAssignmentSummaryReport(filters);
      case 'current':
        return this.generateCurrentAssignmentsReport(filters);
      case 'history':
        return this.generateAssignmentHistoryReport(filters);
      default:
        throw new Error(`Unknown report type: ${type}`);
    }
  }

  getReportTypes(): string[] {
    return ['summary', 'current', 'history'];
  }

  async createAssignment(vehicleId: string, payload: CreateAssignmentPayload): Promise<any> {
    return await addAssignment(vehicleId, payload);
  }

  async closeAssignment(vehicleId: string, assignmentId: string, endDate?: string): Promise<any> {
    return await closeAssignment(vehicleId, assignmentId, endDate);
  }

  // Métodos de reporte
  async generateAssignmentSummaryReport(_filters?: AssignmentFilters): Promise<any> {
    // Implementación futura del reporte de resumen de asignaciones
    return {
      type: 'assignment-summary',
      message: 'Reporte de asignaciones no implementado aún'
    };
  }

  async generateCurrentAssignmentsReport(_filters?: AssignmentFilters): Promise<any> {
    // Implementación futura del reporte de asignaciones actuales
    return {
      type: 'current-assignments',
      message: 'Reporte de asignaciones actuales no implementado aún'
    };
  }

  async generateAssignmentHistoryReport(_filters?: AssignmentFilters): Promise<any> {
    // Implementación futura del reporte de historial de asignaciones
    return {
      type: 'assignment-history',
      message: 'Reporte de historial de asignaciones no implementado aún'
    };
  }
}