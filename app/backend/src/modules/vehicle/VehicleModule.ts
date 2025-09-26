import { Router } from "express";
import { IModule, ModuleStatus, IModuleMetadata, IModuleConfig } from "../../core/interfaces/IModule.js";
import { VehicleService } from "./VehicleService.js";
import { VehicleController } from "./VehicleController.js";

/**
 * Módulo de Vehículos
 * Maneja las operaciones CRUD básicas de vehículos
 */
export class VehicleModule implements IModule {
  public service: VehicleService;
  public controller: VehicleController;
  private status: ModuleStatus = ModuleStatus.DISABLED;
  public config: IModuleConfig;

  constructor(config: IModuleConfig) {
    this.config = config;
    this.service = new VehicleService();
    this.controller = new VehicleController(this.service);
  }

  // ==================== PROPIEDADES DEL MÓDULO ====================

  get id(): string {
    return this.config.id;
  }

  get name(): string {
    return this.config.name;
  }

  get version(): string {
    return this.config.version;
  }

  get description(): string {
    return this.config.description;
  }

  get author(): string {
    return "Tracktor Team";
  }

  get dependencies(): string[] {
    return ["database"];
  }

  get capabilities(): string[] {
    return [
      "vehicle-crud",
      "vehicle-reports", 
      "vehicle-stats",
      "plate-validation"
    ];
  }

  // ==================== GESTIÓN DEL MÓDULO ====================

  /**
   * Inicializar el módulo
   */
  async initialize(): Promise<void> {
    try {
      console.log(`Inicializando ${this.name}...`);
      
      // Inicializar servicio
      await this.service.initialize();
      
      this.status = ModuleStatus.READY;
      console.log(`${this.name} inicializado correctamente`);
    } catch (error) {
      console.error(`Error al inicializar ${this.name}:`, error);
      this.status = ModuleStatus.ERROR;
      throw error;
    }
  }

  /**
   * Habilitar el módulo
   */
  async enable(): Promise<void> {
    if (this.status !== ModuleStatus.READY) {
      throw new Error(`No se puede habilitar ${this.name}. Estado actual: ${this.status}`);
    }
    
    this.status = ModuleStatus.READY;
    console.log(`${this.name} habilitado`);
  }

  /**
   * Deshabilitar el módulo
   */
  async disable(): Promise<void> {
    this.status = ModuleStatus.READY;
    console.log(`${this.name} deshabilitado`);
  }

  /**
   * Limpiar recursos del módulo
   */
  async cleanup(): Promise<void> {
    try {
      console.log(`Limpiando ${this.name}...`);
      await this.service.cleanup();
      this.status = ModuleStatus.DISABLED;
      console.log(`${this.name} limpiado correctamente`);
    } catch (error) {
      console.error(`Error al limpiar ${this.name}:`, error);
      throw error;
    }
  }

  // ==================== ESTADO Y SALUD ====================

  /**
   * Obtener estado del módulo
   */
  getStatus(): ModuleStatus {
    return this.status;
  }

  /**
   * Verificar salud del módulo
   */
  async checkHealth(): Promise<{ healthy: boolean; details?: any }> {
    try {
      // Verificar que el servicio esté funcionando
      await this.service.getStats();
      
      return {
        healthy: true,
        details: {
          status: this.status,
          service: "operational",
          database: "connected",
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      return {
        healthy: false,
        details: {
          status: this.status,
          error: error instanceof Error ? error.message : "Error desconocido",
          timestamp: new Date().toISOString()
        }
      };
    }
  }

  // ==================== ROUTER Y METADATOS ====================

  /**
   * Obtener router del módulo
   */
  getRouter(): Router {
    return this.controller.getRouter();
  }

  /**
   * Obtener metadatos del módulo
   */
  getMetadata(): IModuleMetadata {
    return {
      routes: [
        "GET /vehicles - Obtener todos los vehículos",
        "GET /vehicles/:id - Obtener vehículo por ID",
        "POST /vehicles - Crear nuevo vehículo",
        "PUT /vehicles/:id - Actualizar vehículo",
        "DELETE /vehicles/:id - Eliminar vehículo",
        "GET /vehicles/stats - Obtener estadísticas",
        "GET /vehicles/reports - Obtener tipos de reportes",
        "GET /vehicles/reports/:type - Generar reporte",
        "GET /vehicles/check-plate/:licensePlate - Verificar placa",
        "GET /vehicles/test - Probar módulo"
      ],
      permissions: [
        "vehicle:read",
        "vehicle:create", 
        "vehicle:update",
        "vehicle:delete",
        "vehicle:reports"
      ],
      schemas: [
        "vehicleTable"
      ],
      migrations: [
        "001_create_vehicles_table"
      ]
    };
  }

  // ==================== MÉTODOS DE ACCESO ====================

  /**
   * Obtener servicio del módulo
   */
  getService(): VehicleService {
    return this.service;
  }

  /**
   * Obtener controlador del módulo
   */
  getController(): VehicleController {
    return this.controller;
  }

  /**
   * Verificar si el módulo está habilitado
   */
  isEnabled(): boolean {
    return this.status === ModuleStatus.READY;
  }

  /**
   * Verificar si el módulo está listo
   */
  isReady(): boolean {
    return this.status === ModuleStatus.READY;
  }

  /**
   * Obtener información completa del módulo
   */
  getInfo(): any {
    return {
      id: this.id,
      name: this.name,
      version: this.version,
      description: this.description,
      author: this.author,
      status: this.status,
      dependencies: this.dependencies,
      capabilities: this.capabilities,
      metadata: this.getMetadata()
    };
  }
}