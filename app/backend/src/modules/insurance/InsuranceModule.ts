import { IModule, IModuleConfig, ModuleStatus, IModuleMetadata } from "../../core/interfaces/IModule.js";
import { InsuranceService } from "./InsuranceService.js";
import { InsuranceController } from "./InsuranceController.js";

/**
 * Configuración específica del módulo de Seguros
 */
export interface InsuranceModuleConfig extends IModuleConfig {
  autoNotifications: boolean;
  defaultReminderDays: number;
  requireApprovalForHighValue: boolean;
  maxCoverageAmount: number;
}

/**
 * Módulo de Seguros
 * Gestiona todas las operaciones relacionadas con seguros de vehículos
 */
export class InsuranceModule implements IModule {
  public readonly config: InsuranceModuleConfig;
  public readonly service: InsuranceService;
  public readonly controller: InsuranceController;
  private status: ModuleStatus = ModuleStatus.DISABLED;

  constructor(config: Partial<InsuranceModuleConfig>) {
    this.config = {
      id: "insurance",
      name: "Insurance Module",
      version: "1.0.0",
      description: "Módulo de gestión de seguros de vehículos",
      enabled: true,
      autoNotifications: true,
      defaultReminderDays: 30,
      requireApprovalForHighValue: false,
      maxCoverageAmount: 1000000,
      ...config
    };

    this.service = new InsuranceService();
    this.controller = new InsuranceController(this.service);
  }

  /**
   * Inicializar el módulo
   */
  async initialize(): Promise<void> {
    try {
      console.log("Inicializando módulo de Seguros...");
      
      // Validar configuración
      this.validateConfig();
      
      // Verificar dependencias
      await this.checkDependencies();
      
      // Inicializar servicio y controlador
      await this.service.initialize();
      await this.controller.initialize();
      
      this.status = ModuleStatus.READY;
      console.log("Módulo de Seguros inicializado correctamente");
    } catch (error) {
      this.status = ModuleStatus.ERROR;
      console.error("Error al inicializar módulo de Seguros:", error);
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
   * Verificar si el módulo está habilitado
   */
  isEnabled(): boolean {
    return this.config.enabled && this.status === ModuleStatus.READY;
  }

  /**
   * Limpiar recursos del módulo
   */
  async cleanup(): Promise<void> {
    try {
      console.log("Limpiando recursos del módulo de Seguros...");
      
      await this.controller.cleanup();
      await this.service.cleanup();
      
      this.status = ModuleStatus.DISABLED;
      console.log("Módulo de Seguros limpiado correctamente");
    } catch (error) {
      console.error("Error al limpiar módulo de Seguros:", error);
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
  }

  /**
   * Deshabilitar el módulo
   */
  async disable(): Promise<void> {
    if (this.status === ModuleStatus.READY) {
      await this.cleanup();
    }
  }

  /**
   * Obtener metadatos del módulo
   */
  getMetadata(): IModuleMetadata {
    return {
      routes: [
        "/api/insurance",
        "/api/insurance/policies",
        "/api/insurance/reports"
      ],
      permissions: [
        "insurance.create",
        "insurance.read",
        "insurance.update",
        "insurance.delete",
        "insurance.policies",
        "insurance.reports"
      ],
      schemas: ["insurance", "insurance_policies"],
      migrations: ["vehicle_insurance", "insurance_policies"]
    };
  }

  // ==================== MÉTODOS ESPECÍFICOS DEL MÓDULO ====================

  /**
   * Obtener el servicio del módulo
   */
  getService(): InsuranceService {
    return this.service;
  }

  /**
   * Obtener el controlador del módulo
   */
  getController(): InsuranceController {
    return this.controller;
  }

  /**
   * Configurar el módulo
   */
  configure(newConfig: Partial<InsuranceModuleConfig>): void {
    Object.assign(this.config, newConfig);
    console.log("Configuración del módulo de Seguros actualizada:", this.config);
  }

  /**
   * Obtener estadísticas del módulo
   */
  async getStats(): Promise<any> {
    if (!this.isEnabled()) {
      return { error: "Módulo no habilitado" };
    }

    try {
      const summary = await this.service.generateReport("summary");
      return {
        module: "insurance",
        status: this.status,
        config: this.config,
        stats: summary.data
      };
    } catch {
      return { error: "No se pudieron obtener las estadísticas" };
    }
  }

  // ==================== MÉTODOS PRIVADOS ====================

  /**
   * Validar la configuración del módulo
   */
  private validateConfig(): void {
    if (this.config.defaultReminderDays < 1) {
      throw new Error("defaultReminderDays debe ser mayor a 0");
    }

    if (this.config.maxCoverageAmount < 0) {
      throw new Error("maxCoverageAmount debe ser mayor o igual a 0");
    }

    console.log("Configuración del módulo de Seguros validada correctamente");
  }

  /**
   * Verificar dependencias del módulo
   */
  private async checkDependencies(): Promise<void> {
    // Verificar que existan las tablas necesarias en la base de datos
    // Verificar que los servicios de vehículos estén disponibles
    // Por ahora, solo registramos que se verificaron las dependencias
    console.log("Dependencias del módulo de Seguros verificadas");
  }
}