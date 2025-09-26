import { IModule, IModuleConfig, IModuleMetadata, ModuleStatus } from "../../core/interfaces/IModule.js";
import { MaintenanceService } from "./MaintenanceService.js";
import { MaintenanceController } from "./MaintenanceController.js";

/**
 * Configuración específica del módulo de Mantenimiento
 */
export interface MaintenanceModuleConfig extends IModuleConfig {
  autoNotifications?: boolean;
  defaultMaintenanceInterval?: number; // en días
  requireApprovalForExpensiveRepairs?: boolean;
  expensiveRepairThreshold?: number; // en moneda local
}

/**
 * Módulo de Mantenimiento
 * Gestiona todas las operaciones relacionadas con el mantenimiento de vehículos
 */
export class MaintenanceModule implements IModule {
  public config: IModuleConfig;
  public service: MaintenanceService;
  public controller: MaintenanceController;
  private status: ModuleStatus = ModuleStatus.UNINITIALIZED;

  constructor(config: MaintenanceModuleConfig) {
    this.config = config;
    this.service = new MaintenanceService();
    this.controller = new MaintenanceController(this.service);
  }

  /**
   * Inicializar el módulo de Mantenimiento
   */
  async initialize(): Promise<void> {
    try {
      console.log("Inicializando módulo de Mantenimiento...");
      this.status = ModuleStatus.INITIALIZING;
      
      // Inicializar servicio y controlador
      await this.service.initialize();
      await this.controller.initialize();
      
      // Configuraciones específicas del módulo
      const config = this.config as MaintenanceModuleConfig;
      
      if (config.autoNotifications) {
        console.log("Configurando notificaciones automáticas de mantenimiento...");
      }
      
      if (config.defaultMaintenanceInterval) {
        console.log(`Intervalo de mantenimiento por defecto: ${config.defaultMaintenanceInterval} días`);
      }
      
      this.status = ModuleStatus.READY;
      console.log("Módulo de Mantenimiento inicializado exitosamente");
    } catch (error) {
      this.status = ModuleStatus.ERROR;
      console.error("Error al inicializar el módulo de Mantenimiento:", error);
      throw error;
    }
  }

  /**
   * Verificar si el módulo está listo
   */
  isReady(): boolean {
    return this.status === ModuleStatus.READY;
  }

  /**
   * Obtener el estado del módulo
   */
  getStatus(): ModuleStatus {
    return this.status;
  }

  /**
   * Limpiar recursos del módulo
   */
  async cleanup(): Promise<void> {
    try {
      console.log("Limpiando recursos del módulo de Mantenimiento...");
      
      await this.service.cleanup();
      await this.controller.cleanup();
      
      this.status = ModuleStatus.DISABLED;
      console.log("Recursos del módulo de Mantenimiento limpiados");
    } catch (error) {
      console.error("Error al limpiar recursos del módulo de Mantenimiento:", error);
      throw error;
    }
  }

  /**
   * Habilitar el módulo
   */
  async enable(): Promise<void> {
    if (this.status === ModuleStatus.DISABLED) {
      await this.initialize();
    }
    this.config.enabled = true;
  }

  /**
   * Deshabilitar el módulo
   */
  async disable(): Promise<void> {
    await this.cleanup();
    this.config.enabled = false;
  }

  /**
   * Obtener metadatos del módulo
   */
  getMetadata(): IModuleMetadata {
    return {
      routes: [
        "GET /api/maintenance",
        "POST /api/maintenance",
        "GET /api/maintenance/:id",
        "PUT /api/maintenance/:id",
        "DELETE /api/maintenance/:id",
        "POST /api/maintenance/orders",
        "GET /api/maintenance/orders/vehicle/:vehicleId",
        "POST /api/maintenance/logs",
        "GET /api/maintenance/logs/vehicle/:vehicleId",
        "GET /api/maintenance/reports",
        "GET /api/maintenance/reports/:type"
      ],
      permissions: [
        "maintenance:read",
        "maintenance:write",
        "maintenance:delete",
        "maintenance:reports"
      ],
      schemas: [
        "vehicle_maintenance",
        "maintenance_orders",
        "maintenance_order_history",
        "workshops"
      ]
    };
  }

  // ==================== MÉTODOS ESPECÍFICOS DEL MÓDULO ====================

  /**
   * Obtener el servicio de mantenimiento
   */
  getMaintenanceService(): MaintenanceService {
    return this.service;
  }

  /**
   * Obtener el controlador de mantenimiento
   */
  getMaintenanceController(): MaintenanceController {
    return this.controller;
  }

  /**
   * Configurar notificaciones automáticas
   */
  async configureAutoNotifications(enabled: boolean): Promise<void> {
    const config = this.config as MaintenanceModuleConfig;
    config.autoNotifications = enabled;
    
    if (enabled) {
      console.log("Notificaciones automáticas de mantenimiento habilitadas");
    } else {
      console.log("Notificaciones automáticas de mantenimiento deshabilitadas");
    }
  }

  /**
   * Establecer intervalo de mantenimiento por defecto
   */
  async setDefaultMaintenanceInterval(days: number): Promise<void> {
    if (days <= 0) {
      throw new Error("El intervalo de mantenimiento debe ser mayor a 0");
    }
    
    const config = this.config as MaintenanceModuleConfig;
    config.defaultMaintenanceInterval = days;
    
    console.log(`Intervalo de mantenimiento por defecto establecido en ${days} días`);
  }

  /**
   * Validar la configuración del módulo
   */
  private validateConfig(config: MaintenanceModuleConfig): boolean {
    if (config.defaultMaintenanceInterval !== undefined) {
      if (config.defaultMaintenanceInterval <= 0) {
        console.error("El intervalo de mantenimiento debe ser mayor a 0");
        return false;
      }
    }
    
    if (config.expensiveRepairThreshold !== undefined) {
      if (config.expensiveRepairThreshold < 0) {
        console.error("El umbral de reparación costosa no puede ser negativo");
        return false;
      }
    }
    
    return true;
  }
}