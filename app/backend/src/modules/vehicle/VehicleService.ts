import { IModuleService } from "../../core/interfaces/IModule.js";
import { db } from "../../db/index.js";
import * as schema from "../../db/schema/index.js";
import { eq } from "drizzle-orm";

/**
 * Interfaz para un registro de vehículo básico
 */
export interface VehicleRecord {
  id: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  vin?: string;
  vinNumber?: string;
  engineNumber?: string;
  color?: string;
  odometer?: number;
  tankSizeLiters?: number;
  ownerName?: string;
  ownershipTypeId?: string;
  status?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Payload para crear un vehículo
 */
export interface CreateVehiclePayload {
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  vin?: string;
  vinNumber?: string;
  engineNumber?: string;
  color?: string;
  odometer?: number;
  tankSizeLiters?: number;
  ownerName?: string;
  ownershipTypeId?: string;
  status?: string;
}

/**
 * Payload para actualizar un vehículo
 */
export interface UpdateVehiclePayload {
  make?: string;
  model?: string;
  year?: number;
  licensePlate?: string;
  vin?: string;
  vinNumber?: string;
  engineNumber?: string;
  color?: string;
  odometer?: number;
  tankSizeLiters?: number;
  ownerName?: string;
  ownershipTypeId?: string;
  status?: string;
}

/**
 * Filtros para búsqueda de vehículos
 */
export interface VehicleFilters {
  search?: string;
  status?: string;
  make?: string;
  model?: string;
  year?: number;
  ownershipTypeId?: string;
}

/**
 * Servicio del módulo de vehículos
 * Maneja solo las operaciones CRUD básicas de vehículos
 */
export class VehicleService implements IModuleService<VehicleRecord, CreateVehiclePayload, UpdateVehiclePayload> {
  
  /**
   * Inicializar el servicio
   */
  async initialize(): Promise<void> {
    console.log("Inicializando servicio de Vehículos...");
    // Verificar conexión a la base de datos
    try {
      await db.query.vehicleTable.findFirst();
      console.log("Servicio de Vehículos inicializado correctamente");
    } catch (error) {
      console.error("Error al inicializar servicio de Vehículos:", error);
      throw error;
    }
  }

  /**
   * Limpiar recursos del servicio
   */
  async cleanup(): Promise<void> {
    console.log("Limpiando servicio de Vehículos...");
    // No hay recursos específicos que limpiar
  }

  // ==================== OPERACIONES CRUD ====================

  /**
   * Crear un nuevo vehículo
   */
  async create(data: CreateVehiclePayload): Promise<VehicleRecord> {
    const vehicleData = {
      ...data,
      status: data.status || "active"
    };

    const [result] = await db
      .insert(schema.vehicleTable)
      .values(vehicleData)
      .returning();

    return this.mapToVehicleRecord(result);
  }

  /**
   * Obtener todos los vehículos con filtros opcionales
   */
  async getAll(filters?: VehicleFilters): Promise<VehicleRecord[]> {
    let query = db.query.vehicleTable.findMany({
      orderBy: (vehicles, { desc }) => [desc(vehicles.created_at)]
    });

    const vehicles = await query;
    let filteredVehicles = vehicles;

    // Aplicar filtros
    if (filters?.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredVehicles = filteredVehicles.filter(vehicle => 
        vehicle.make?.toLowerCase().includes(searchTerm) ||
        vehicle.model?.toLowerCase().includes(searchTerm) ||
        vehicle.licensePlate?.toLowerCase().includes(searchTerm) ||
        vehicle.vin?.toLowerCase().includes(searchTerm) ||
        vehicle.ownerName?.toLowerCase().includes(searchTerm)
      );
    }

    if (filters?.status) {
      filteredVehicles = filteredVehicles.filter(vehicle => 
        vehicle.status === filters.status
      );
    }

    if (filters?.make) {
      filteredVehicles = filteredVehicles.filter(vehicle => 
        vehicle.make?.toLowerCase() === filters.make?.toLowerCase()
      );
    }

    if (filters?.model) {
      filteredVehicles = filteredVehicles.filter(vehicle => 
        vehicle.model?.toLowerCase() === filters.model?.toLowerCase()
      );
    }

    if (filters?.year) {
      filteredVehicles = filteredVehicles.filter(vehicle => 
        vehicle.year === filters.year
      );
    }

    if (filters?.ownershipTypeId) {
      filteredVehicles = filteredVehicles.filter(vehicle => 
        vehicle.ownershipTypeId === filters.ownershipTypeId
      );
    }

    return filteredVehicles.map(this.mapToVehicleRecord);
  }

  /**
   * Obtener un vehículo por ID
   */
  async getById(id: string): Promise<VehicleRecord | null> {
    const vehicle = await db.query.vehicleTable.findFirst({
      where: (vehicles, { eq }) => eq(vehicles.id, id)
    });

    return vehicle ? this.mapToVehicleRecord(vehicle) : null;
  }

  /**
   * Actualizar un vehículo
   */
  async update(id: string, data: UpdateVehiclePayload): Promise<VehicleRecord> {
    const [updated] = await db
      .update(schema.vehicleTable)
      .set(data)
      .where(eq(schema.vehicleTable.id, id))
      .returning();

    if (!updated) {
      throw new Error(`Vehículo con ID ${id} no encontrado`);
    }

    return this.mapToVehicleRecord(updated);
  }

  /**
   * Eliminar un vehículo
   */
  async delete(id: string): Promise<boolean> {
    const result = await db
      .delete(schema.vehicleTable)
      .where(eq(schema.vehicleTable.id, id));

    return result.rowsAffected > 0;
  }

  // ==================== OPERACIONES DE REPORTES ====================

  /**
   * Generar reporte de vehículos
   */
  async generateReport(type: string, filters?: any): Promise<any> {
    switch (type) {
      case "summary":
        return this.generateSummaryReport(filters);
      case "by-status":
        return this.generateStatusReport(filters);
      case "by-make":
        return this.generateMakeReport(filters);
      case "by-year":
        return this.generateYearReport(filters);
      default:
        throw new Error(`Tipo de reporte no soportado: ${type}`);
    }
  }

  /**
   * Obtener tipos de reportes disponibles
   */
  getReportTypes(): string[] {
    return ["summary", "by-status", "by-make", "by-year"];
  }

  // ==================== MÉTODOS AUXILIARES ====================

  /**
   * Obtener estadísticas básicas de vehículos
   */
  async getStats(): Promise<any> {
    const vehicles = await this.getAll();
    
    const stats = {
      total: vehicles.length,
      byStatus: {} as Record<string, number>,
      byMake: {} as Record<string, number>,
      byYear: {} as Record<number, number>,
      averageYear: 0,
      oldestYear: 0,
      newestYear: 0
    };

    // Calcular estadísticas
    vehicles.forEach(vehicle => {
      // Por estado
      stats.byStatus[vehicle.status || "unknown"] = 
        (stats.byStatus[vehicle.status || "unknown"] || 0) + 1;

      // Por marca
      stats.byMake[vehicle.make] = (stats.byMake[vehicle.make] || 0) + 1;

      // Por año
      stats.byYear[vehicle.year] = (stats.byYear[vehicle.year] || 0) + 1;
    });

    // Calcular años
    const years = vehicles.map(v => v.year).filter(Boolean);
    if (years.length > 0) {
      stats.averageYear = Math.round(years.reduce((a, b) => a + b, 0) / years.length);
      stats.oldestYear = Math.min(...years);
      stats.newestYear = Math.max(...years);
    }

    return stats;
  }

  /**
   * Verificar si existe un vehículo con la placa dada
   */
  async existsByLicensePlate(licensePlate: string, excludeId?: string): Promise<boolean> {
    const vehicle = await db.query.vehicleTable.findFirst({
      where: (vehicles, { eq, and, ne }) => 
        excludeId 
          ? and(eq(vehicles.licensePlate, licensePlate), ne(vehicles.id, excludeId))
          : eq(vehicles.licensePlate, licensePlate)
    });

    return !!vehicle;
  }

  // ==================== MÉTODOS PRIVADOS ====================

  /**
   * Mapear registro de base de datos a VehicleRecord
   */
  private mapToVehicleRecord(vehicle: any): VehicleRecord {
    return {
      id: vehicle.id,
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      licensePlate: vehicle.licensePlate,
      vin: vehicle.vin,
      vinNumber: vehicle.vinNumber,
      engineNumber: vehicle.engineNumber,
      color: vehicle.color,
      odometer: vehicle.odometer,
      tankSizeLiters: vehicle.tankSizeLiters,
      ownerName: vehicle.ownerName,
      ownershipTypeId: vehicle.ownershipTypeId,
      status: vehicle.status || "active",
      created_at: vehicle.created_at,
      updated_at: vehicle.updated_at
    };
  }

  /**
   * Generar reporte resumen
   */
  private async generateSummaryReport(_filters?: any): Promise<any> {
    const stats = await this.getStats();
    return {
      type: "summary",
      generatedAt: new Date().toISOString(),
      data: stats
    };
  }

  /**
   * Generar reporte por estado
   */
  private async generateStatusReport(filters?: any): Promise<any> {
    const vehicles = await this.getAll(filters);
    const byStatus = vehicles.reduce((acc, vehicle) => {
      const status = vehicle.status || "unknown";
      if (!acc[status]) {
        acc[status] = [];
      }
      acc[status].push(vehicle);
      return acc;
    }, {} as Record<string, VehicleRecord[]>);

    return {
      type: "by-status",
      generatedAt: new Date().toISOString(),
      data: byStatus
    };
  }

  /**
   * Generar reporte por marca
   */
  private async generateMakeReport(filters?: any): Promise<any> {
    const vehicles = await this.getAll(filters);
    const byMake = vehicles.reduce((acc, vehicle) => {
      const make = vehicle.make;
      if (!acc[make]) {
        acc[make] = [];
      }
      acc[make].push(vehicle);
      return acc;
    }, {} as Record<string, VehicleRecord[]>);

    return {
      type: "by-make",
      generatedAt: new Date().toISOString(),
      data: byMake
    };
  }

  /**
   * Generar reporte por año
   */
  private async generateYearReport(filters?: any): Promise<any> {
    const vehicles = await this.getAll(filters);
    const byYear = vehicles.reduce((acc, vehicle) => {
      const year = vehicle.year.toString();
      if (!acc[year]) {
        acc[year] = [];
      }
      acc[year].push(vehicle);
      return acc;
    }, {} as Record<string, VehicleRecord[]>);

    return {
      type: "by-year",
      generatedAt: new Date().toISOString(),
      data: byYear
    };
  }
}