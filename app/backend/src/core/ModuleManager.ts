import { Router } from "express";
import { IModule, IModuleConfig, ModuleStatus } from "./interfaces/IModule.js";

/**
 * Configuración del sistema de módulos
 */
export interface IModuleSystemConfig {
  /** Módulos habilitados por defecto */
  enabledModules: string[];
  /** Configuraciones específicas por módulo */
  moduleConfigs: Record<string, Partial<IModuleConfig>>;
  /** Configuración global */
  global: {
    autoInitialize: boolean;
    strictDependencies: boolean;
  };
}

/**
 * Gestor central de módulos del sistema
 */
export class ModuleManager {
  private modules: Map<string, IModule> = new Map();
  private initializationOrder: string[] = [];
  private systemConfig: IModuleSystemConfig;

  constructor(systemConfig: IModuleSystemConfig) {
    this.systemConfig = systemConfig;
  }

  /**
   * Registrar un módulo en el sistema
   */
  async registerModule(module: IModule): Promise<void> {
    const moduleId = module.config.id;
    
    if (this.modules.has(moduleId)) {
      throw new Error(`Módulo ${moduleId} ya está registrado`);
    }

    // Aplicar configuración del sistema si existe
    if (this.systemConfig.moduleConfigs[moduleId]) {
      module.config = { 
        ...module.config, 
        ...this.systemConfig.moduleConfigs[moduleId] 
      };
    }

    // Verificar si el módulo debe estar habilitado
    module.config.enabled = this.systemConfig.enabledModules.includes(moduleId);

    this.modules.set(moduleId, module);
    
    console.log(`Módulo ${moduleId} registrado`);

    // Auto-inicializar si está configurado
    if (this.systemConfig.global.autoInitialize && module.config.enabled) {
      await this.initializeModule(moduleId);
    }
  }

  /**
   * Inicializar un módulo específico
   */
  async initializeModule(moduleId: string): Promise<void> {
    const module = this.modules.get(moduleId);
    
    if (!module) {
      throw new Error(`Módulo ${moduleId} no encontrado`);
    }

    if (!module.config.enabled) {
      console.log(`Módulo ${moduleId} está deshabilitado, omitiendo inicialización`);
      return;
    }

    // Verificar e inicializar dependencias primero
    if (module.config.dependencies) {
      for (const depId of module.config.dependencies) {
        await this.ensureDependencyInitialized(depId);
      }
    }

    await module.initialize();
    
    // Agregar al orden de inicialización si no está ya
    if (!this.initializationOrder.includes(moduleId)) {
      this.initializationOrder.push(moduleId);
    }
  }

  /**
   * Inicializar todos los módulos habilitados
   */
  async initializeAllModules(): Promise<void> {
    const enabledModules = Array.from(this.modules.values())
      .filter(module => module.config.enabled);

    // Ordenar por dependencias
    const sortedModules = this.sortModulesByDependencies(enabledModules);

    for (const module of sortedModules) {
      if (module.getStatus() === ModuleStatus.UNINITIALIZED) {
        await this.initializeModule(module.config.id);
      }
    }
  }

  /**
   * Obtener el router combinado de todos los módulos
   */
  getCombinedRouter(): Router {
    const combinedRouter = Router();

    for (const module of this.modules.values()) {
      if (module.isReady()) {
        const moduleRouter = module.controller.getRouter();
        combinedRouter.use(`/${module.config.id}`, moduleRouter);
      }
    }

    return combinedRouter;
  }

  /**
   * Habilitar un módulo
   */
  async enableModule(moduleId: string): Promise<void> {
    const module = this.modules.get(moduleId);
    
    if (!module) {
      throw new Error(`Módulo ${moduleId} no encontrado`);
    }

    await module.enable();
    
    // Actualizar configuración del sistema
    if (!this.systemConfig.enabledModules.includes(moduleId)) {
      this.systemConfig.enabledModules.push(moduleId);
    }
  }

  /**
   * Deshabilitar un módulo
   */
  async disableModule(moduleId: string): Promise<void> {
    const module = this.modules.get(moduleId);
    
    if (!module) {
      throw new Error(`Módulo ${moduleId} no encontrado`);
    }

    // Verificar dependencias antes de deshabilitar
    const dependentModules = this.getDependentModules(moduleId);
    if (dependentModules.length > 0 && this.systemConfig.global.strictDependencies) {
      throw new Error(
        `No se puede deshabilitar ${moduleId}. Los siguientes módulos dependen de él: ${dependentModules.join(', ')}`
      );
    }

    await module.disable();
    
    // Actualizar configuración del sistema
    this.systemConfig.enabledModules = this.systemConfig.enabledModules
      .filter(id => id !== moduleId);
  }

  /**
   * Obtener información de todos los módulos
   */
  getModulesInfo(): Array<{
    id: string;
    name: string;
    version: string;
    status: ModuleStatus;
    enabled: boolean;
    dependencies: string[];
  }> {
    return Array.from(this.modules.values()).map(module => ({
      id: module.config.id,
      name: module.config.name,
      version: module.config.version,
      status: module.getStatus(),
      enabled: module.config.enabled,
      dependencies: module.config.dependencies || []
    }));
  }

  /**
   * Obtener un módulo específico
   */
  getModule(moduleId: string): IModule | undefined {
    return this.modules.get(moduleId);
  }

  /**
   * Verificar si un módulo está disponible y listo
   */
  isModuleReady(moduleId: string): boolean {
    const module = this.modules.get(moduleId);
    return module ? module.isReady() : false;
  }

  /**
   * Limpiar todos los módulos
   */
  async cleanup(): Promise<void> {
    // Limpiar en orden inverso de inicialización
    const cleanupOrder = [...this.initializationOrder].reverse();
    
    for (const moduleId of cleanupOrder) {
      const module = this.modules.get(moduleId);
      if (module && module.isReady()) {
        await module.cleanup();
      }
    }
  }

  /**
   * Asegurar que una dependencia esté inicializada
   */
  private async ensureDependencyInitialized(depId: string): Promise<void> {
    const depModule = this.modules.get(depId);
    
    if (!depModule) {
      if (this.systemConfig.global.strictDependencies) {
        throw new Error(`Dependencia requerida ${depId} no encontrada`);
      }
      console.warn(`Dependencia ${depId} no encontrada, continuando...`);
      return;
    }

    if (!depModule.config.enabled) {
      if (this.systemConfig.global.strictDependencies) {
        throw new Error(`Dependencia requerida ${depId} está deshabilitada`);
      }
      console.warn(`Dependencia ${depId} está deshabilitada, continuando...`);
      return;
    }

    if (depModule.getStatus() === ModuleStatus.UNINITIALIZED) {
      await this.initializeModule(depId);
    }
  }

  /**
   * Obtener módulos que dependen de un módulo específico
   */
  private getDependentModules(moduleId: string): string[] {
    const dependents: string[] = [];
    
    for (const module of this.modules.values()) {
      if (module.config.dependencies?.includes(moduleId)) {
        dependents.push(module.config.id);
      }
    }
    
    return dependents;
  }

  /**
   * Ordenar módulos por dependencias
   */
  private sortModulesByDependencies(modules: IModule[]): IModule[] {
    const sorted: IModule[] = [];
    const visited = new Set<string>();
    const visiting = new Set<string>();

    const visit = (module: IModule) => {
      if (visiting.has(module.config.id)) {
        throw new Error(`Dependencia circular detectada en módulo ${module.config.id}`);
      }
      
      if (visited.has(module.config.id)) {
        return;
      }

      visiting.add(module.config.id);

      // Visitar dependencias primero
      if (module.config.dependencies) {
        for (const depId of module.config.dependencies) {
          const depModule = modules.find(m => m.config.id === depId);
          if (depModule) {
            visit(depModule);
          }
        }
      }

      visiting.delete(module.config.id);
      visited.add(module.config.id);
      sorted.push(module);
    };

    for (const module of modules) {
      visit(module);
    }

    return sorted;
  }
}