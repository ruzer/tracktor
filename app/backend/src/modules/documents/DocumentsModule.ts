import { IModule, IModuleConfig, ModuleStatus } from "../../core/interfaces/IModule.js";
import { DocumentsService } from "./DocumentsService.js";
import { DocumentsController } from "./DocumentsController.js";
import { Router } from "express";

/**
 * Configuración del módulo de documentos
 */
export interface DocumentsModuleConfig extends IModuleConfig {
  id: "documents";
  name: "Documents Module";
  version: "1.0.0";
  description: "Módulo para gestión de documentos de vehículos (PUCC, impuestos, documentos generales)";
}

/**
 * Módulo de documentos para vehículos
 * Maneja PUCC (certificados de contaminación), impuestos y documentos generales
 */
export class DocumentsModule implements IModule {
  public readonly config: DocumentsModuleConfig;
  public readonly service: DocumentsService;
  public readonly controller: DocumentsController;
  private moduleStatus: ModuleStatus = ModuleStatus.UNINITIALIZED;

  constructor(config: DocumentsModuleConfig) {
    this.config = config;
    this.service = new DocumentsService();
    this.controller = new DocumentsController(this.service);
  }

  /**
   * Inicializa el módulo
   */
  async initialize(): Promise<void> {
    try {
      this.moduleStatus = ModuleStatus.INITIALIZING;
      await this.service.initialize();
      this.moduleStatus = ModuleStatus.READY;
      console.log(`[DocumentsModule] Módulo inicializado correctamente`);
    } catch (error) {
      this.moduleStatus = ModuleStatus.ERROR;
      console.error(`[DocumentsModule] Error al inicializar:`, error);
      throw error;
    }
  }

  /**
   * Obtiene el router del módulo
   */
  getRouter(): Router {
    return this.controller.getRouter();
  }

  /**
   * Verifica si el módulo está listo
   */
  isReady(): boolean {
    return this.moduleStatus === ModuleStatus.READY;
  }

  /**
   * Obtiene el estado del módulo
   */
  getStatus(): ModuleStatus {
    return this.moduleStatus;
  }

  /**
   * Habilita el módulo
   */
  async enable(): Promise<void> {
    if (this.moduleStatus === ModuleStatus.DISABLED) {
      await this.initialize();
    }
  }

  /**
   * Deshabilita el módulo
   */
  async disable(): Promise<void> {
    this.moduleStatus = ModuleStatus.DISABLED;
    await this.cleanup();
  }

  /**
   * Limpia recursos del módulo
   */
  async cleanup(): Promise<void> {
    await this.service.cleanup();
    console.log(`[DocumentsModule] Módulo limpiado`);
  }
}