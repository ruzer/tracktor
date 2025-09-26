import { 
  IModule, 
  IModuleConfig, 
  IModuleService, 
  IModuleController, 
  ModuleStatus,
  IModuleEvents,
  IModuleMetadata 
} from "../interfaces/IModule.js";

/**
 * Clase base abstracta para módulos del sistema
 */
export abstract class BaseModule implements IModule {
  protected status: ModuleStatus = ModuleStatus.UNINITIALIZED;
  protected events: IModuleEvents = {};

  constructor(
    public config: IModuleConfig,
    public service: IModuleService<any, any, any>,
    public controller: IModuleController,
    events?: IModuleEvents
  ) {
    this.events = events || {};
  }

  /**
   * Inicializar el módulo
   */
  async initialize(): Promise<void> {
    try {
      this.status = ModuleStatus.INITIALIZING;
      
      if (this.events.onInitialize) {
        await this.events.onInitialize();
      }

      // Verificar dependencias
      await this.checkDependencies();
      
      // Inicializar servicio
      await this.service.initialize();
      
      this.status = ModuleStatus.READY;
      
      if (this.events.onReady) {
        await this.events.onReady();
      }
      
      console.log(`Módulo ${this.config.name} inicializado correctamente`);
    } catch (error) {
      this.status = ModuleStatus.ERROR;
      
      if (this.events.onError) {
        await this.events.onError(error as Error);
      }
      
      console.error(`Error inicializando módulo ${this.config.name}:`, error);
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
      await this.service.cleanup();
      this.status = ModuleStatus.DISABLED;
      
      if (this.events.onDisable) {
        await this.events.onDisable();
      }
      
      console.log(`Módulo ${this.config.name} deshabilitado`);
    } catch (error) {
      console.error(`Error limpiando módulo ${this.config.name}:`, error);
      throw error;
    }
  }

  /**
   * Verificar dependencias del módulo
   */
  protected async checkDependencies(): Promise<void> {
    if (!this.config.dependencies || this.config.dependencies.length === 0) {
      return;
    }

    // Aquí se implementaría la lógica para verificar que las dependencias estén disponibles
    // Por ahora, solo registramos las dependencias
    console.log(`Módulo ${this.config.name} requiere dependencias:`, this.config.dependencies);
  }

  /**
   * Obtener metadatos del módulo
   */
  abstract getMetadata(): IModuleMetadata;

  /**
   * Validar configuración del módulo
   */
  protected validateConfig(): void {
    if (!this.config.id || !this.config.name || !this.config.version) {
      throw new Error(`Configuración inválida para módulo ${this.config.name || 'desconocido'}`);
    }
  }

  /**
   * Habilitar el módulo
   */
  async enable(): Promise<void> {
    this.config.enabled = true;
    if (this.status === ModuleStatus.DISABLED) {
      await this.initialize();
    }
  }

  /**
   * Deshabilitar el módulo
   */
  async disable(): Promise<void> {
    this.config.enabled = false;
    await this.cleanup();
  }
}