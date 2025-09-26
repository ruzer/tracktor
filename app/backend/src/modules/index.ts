import { ModuleManager, IModuleSystemConfig } from "../core/ModuleManager.js";
import { MaintenanceModule } from "./maintenance/MaintenanceModule.js";
import { InsuranceModule } from "./insurance/InsuranceModule.js";
import { VehicleModule } from "./vehicle/VehicleModule.js";
import { DocumentsModule } from "./documents/DocumentsModule.js";
import { AssignmentModule } from "./assignments/AssignmentModule.js";

/**
 * Configuración del sistema de módulos
 */
const moduleSystemConfig: IModuleSystemConfig = {
  enabledModules: ["maintenance", "insurance", "vehicle", "documents", "assignments"],
  moduleConfigs: {
    maintenance: {
      enabled: true,
      settings: {
        autoNotifications: true,
        defaultMaintenanceInterval: 10000 // 10,000 km
      }
    },
    insurance: {
      enabled: true,
      settings: {
        autoNotifications: true,
        defaultReminderDays: 30
      }
    },
    vehicle: {
      enabled: true,
      settings: {
        autoValidatePlates: true,
        defaultStatus: "active"
      }
    },
    documents: {
      enabled: true,
      settings: {
        autoValidateDates: true,
        defaultReminderDays: 15
      }
    },
    assignments: {
      enabled: true,
      settings: {
        autoCloseExpired: true,
        defaultAssignmentDuration: 365 // días
      }
    }
  },
  global: {
    autoInitialize: true,
    strictDependencies: false
  }
};

/**
 * Instancia del gestor de módulos
 */
export const moduleManager = new ModuleManager(moduleSystemConfig);

/**
 * Inicializar todos los módulos del sistema
 */
export async function initializeModules(): Promise<void> {
  try {
    console.log("Inicializando sistema de módulos...");

    // Crear instancias de los módulos
    const maintenanceModule = new MaintenanceModule({
      id: "maintenance",
      name: "Maintenance Module",
      version: "1.0.0",
      description: "Módulo de gestión de mantenimiento de vehículos",
      enabled: true
    });

    const insuranceModule = new InsuranceModule({
      id: "insurance",
      name: "Insurance Module", 
      version: "1.0.0",
      description: "Módulo de gestión de seguros de vehículos",
      enabled: true
    });

    const vehicleModule = new VehicleModule({
      id: "vehicle",
      name: "Vehicle Module",
      version: "1.0.0", 
      description: "Módulo de gestión básica de vehículos",
      enabled: true
    });

    const documentsModule = new DocumentsModule({
      id: "documents",
      name: "Documents Module",
      version: "1.0.0",
      description: "Módulo para gestión de documentos de vehículos (PUCC, impuestos, documentos generales)",
      enabled: true
    });

    const assignmentModule = new AssignmentModule({
      id: "assignments",
      name: "Assignment Module",
      version: "1.0.0",
      description: "Módulo para gestión de asignaciones de vehículos a conductores",
      enabled: true
    });

    // Registrar módulos
    await moduleManager.registerModule(maintenanceModule);
    await moduleManager.registerModule(insuranceModule);
    await moduleManager.registerModule(vehicleModule);
    await moduleManager.registerModule(documentsModule);
    await moduleManager.registerModule(assignmentModule);

    // Inicializar todos los módulos
    await moduleManager.initializeAllModules();

    console.log("Sistema de módulos inicializado correctamente");
  } catch (error) {
    console.error("Error al inicializar sistema de módulos:", error);
    throw error;
  }
}

/**
 * Obtener el router combinado de todos los módulos
 */
export function getModulesRouter() {
  return moduleManager.getCombinedRouter();
}

/**
 * Obtener información de todos los módulos
 */
export function getModulesInfo() {
  return moduleManager.getModulesInfo();
}

/**
 * Obtener un módulo específico
 */
export function getModule(moduleId: string) {
  return moduleManager.getModule(moduleId);
}

/**
 * Limpiar todos los módulos
 */
export async function cleanupModules(): Promise<void> {
  await moduleManager.cleanup();
}

/**
 * Verificar el estado de salud de los módulos
 */
export async function getModulesHealthCheck(): Promise<any> {
  const modulesInfo = moduleManager.getModulesInfo();
  
  return {
    status: "healthy",
    timestamp: new Date().toISOString(),
    modules: modulesInfo.reduce((acc, module) => {
      acc[module.id] = {
        status: module.status,
        enabled: module.enabled,
        ready: moduleManager.isModuleReady(module.id)
      };
      return acc;
    }, {} as Record<string, any>)
  };
}