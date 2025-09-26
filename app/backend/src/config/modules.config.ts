import { IModuleSystemConfig } from "../core/ModuleManager.js";

/**
 * Configuración del sistema de módulos
 * Aquí se define qué módulos están habilitados y sus configuraciones específicas
 */
export const moduleSystemConfig: IModuleSystemConfig = {
  // Módulos habilitados por defecto
  enabledModules: [
    "maintenance",
    "insurance",
    // "fuel", // Ejemplo de módulo deshabilitado
    // "reports" // Ejemplo de módulo futuro
  ],

  // Configuraciones específicas por módulo
  moduleConfigs: {
    maintenance: {
      settings: {
        autoNotifications: true,
        defaultWorkshop: null,
        maxOrdersPerVehicle: 100,
        reportFormats: ["pdf", "excel"]
      }
    },
    insurance: {
      settings: {
        autoRenewalNotification: true,
        gracePeriodDays: 30,
        defaultCurrency: "USD",
        reportFormats: ["pdf"]
      }
    },
    fuel: {
      enabled: false, // Explícitamente deshabilitado
      settings: {
        trackEfficiency: true,
        alertThresholds: {
          lowFuel: 0.2,
          highConsumption: 1.5
        }
      }
    }
  },

  // Configuración global del sistema
  global: {
    // Auto-inicializar módulos al registrarlos
    autoInitialize: true,
    // Verificación estricta de dependencias
    strictDependencies: true
  }
};

/**
 * Configuración de desarrollo (para testing y desarrollo)
 */
export const developmentModuleConfig: IModuleSystemConfig = {
  enabledModules: [
    "maintenance",
    "insurance",
    "fuel" // Habilitado en desarrollo
  ],
  moduleConfigs: {
    ...moduleSystemConfig.moduleConfigs,
    fuel: {
      enabled: true, // Habilitado para desarrollo
      settings: {
        trackEfficiency: true,
        alertThresholds: {
          lowFuel: 0.1, // Más sensible en desarrollo
          highConsumption: 1.2
        }
      }
    }
  },
  global: {
    autoInitialize: true,
    strictDependencies: false // Menos estricto en desarrollo
  }
};

/**
 * Configuración de producción
 */
export const productionModuleConfig: IModuleSystemConfig = {
  enabledModules: [
    "maintenance",
    "insurance"
    // "fuel" deshabilitado en producción por ahora
  ],
  moduleConfigs: {
    maintenance: {
      settings: {
        autoNotifications: true,
        defaultWorkshop: null,
        maxOrdersPerVehicle: 1000, // Más capacidad en producción
        reportFormats: ["pdf", "excel"]
      }
    },
    insurance: {
      settings: {
        autoRenewalNotification: true,
        gracePeriodDays: 15, // Menos días de gracia en producción
        defaultCurrency: "USD",
        reportFormats: ["pdf"]
      }
    }
  },
  global: {
    autoInitialize: true,
    strictDependencies: true // Muy estricto en producción
  }
};

/**
 * Obtener la configuración según el entorno
 */
export function getModuleConfig(): IModuleSystemConfig {
  const env = process.env.NODE_ENV || "development";
  
  switch (env) {
    case "production":
      return productionModuleConfig;
    case "development":
      return developmentModuleConfig;
    default:
      return moduleSystemConfig;
  }
}