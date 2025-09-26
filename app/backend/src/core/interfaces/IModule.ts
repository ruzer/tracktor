import { Router } from "express";
import { Request, Response } from "express";

/**
 * Configuración base para un módulo
 */
export interface IModuleConfig {
  /** Identificador único del módulo */
  id: string;
  /** Nombre del módulo */
  name: string;
  /** Versión del módulo */
  version: string;
  /** Descripción del módulo */
  description: string;
  /** Si el módulo está habilitado */
  enabled: boolean;
  /** Dependencias de otros módulos */
  dependencies?: string[];
  /** Configuración específica del módulo */
  settings?: Record<string, any>;
}

/**
 * Operaciones CRUD estándar para entidades
 */
export interface ICrudOperations<T, CreatePayload, UpdatePayload> {
  create(payload: CreatePayload): Promise<T>;
  getById(id: string): Promise<T | null>;
  getAll(filters?: Record<string, any>): Promise<T[]>;
  update(id: string, payload: UpdatePayload): Promise<T>;
  delete(id: string): Promise<boolean>;
}

/**
 * Operaciones de reporte estándar
 */
export interface IReportOperations {
  generateReport(type: string, filters?: Record<string, any>): Promise<any>;
  getReportTypes(): string[];
}

/**
 * Servicio base para módulos
 */
export interface IModuleService<T, CreatePayload, UpdatePayload> 
  extends ICrudOperations<T, CreatePayload, UpdatePayload>, IReportOperations {
  /** Inicializar el servicio */
  initialize(): Promise<void>;
  /** Limpiar recursos del servicio */
  cleanup(): Promise<void>;
}

/**
 * Controlador base para módulos
 */
export interface IModuleController {
  /** Obtener el router del módulo */
  getRouter(): Router;
  /** Manejar operaciones CRUD */
  create(req: Request, res: Response): Promise<void>;
  getById(req: Request, res: Response): Promise<void>;
  getAll(req: Request, res: Response): Promise<void>;
  update(req: Request, res: Response): Promise<void>;
  delete(req: Request, res: Response): Promise<void>;
  /** Manejar reportes */
  generateReport(req: Request, res: Response): Promise<void>;
}

/**
 * Interfaz principal del módulo
 */
export interface IModule {
  /** Configuración del módulo */
  config: IModuleConfig;
  /** Servicio del módulo */
  service: IModuleService<any, any, any>;
  /** Controlador del módulo */
  controller: IModuleController;
  
  /** Inicializar el módulo */
  initialize(): Promise<void>;
  /** Verificar si el módulo está listo */
  isReady(): boolean;
  /** Obtener el estado del módulo */
  getStatus(): ModuleStatus;
  /** Limpiar recursos del módulo */
  cleanup(): Promise<void>;
  /** Habilitar el módulo */
  enable(): Promise<void>;
  /** Deshabilitar el módulo */
  disable(): Promise<void>;
}

/**
 * Estados posibles de un módulo
 */
export enum ModuleStatus {
  UNINITIALIZED = "uninitialized",
  INITIALIZING = "initializing",
  READY = "ready",
  ERROR = "error",
  DISABLED = "disabled"
}

/**
 * Eventos del módulo
 */
export interface IModuleEvents {
  onInitialize?: () => Promise<void>;
  onReady?: () => Promise<void>;
  onError?: (error: Error) => Promise<void>;
  onDisable?: () => Promise<void>;
}

/**
 * Metadatos del módulo para registro
 */
export interface IModuleMetadata {
  /** Rutas que expone el módulo */
  routes: string[];
  /** Permisos requeridos */
  permissions?: string[];
  /** Esquemas de base de datos */
  schemas?: string[];
  /** Migraciones */
  migrations?: string[];
}