import { Router, Request, Response } from "express";
import { 
  getModulesInfo, 
  getModule, 
  getModulesHealthCheck,
  moduleManager 
} from "../modules/index.js";

const router = Router();

/**
 * Obtener información de todos los módulos
 */
router.get("/", async (req: Request, res: Response) => {
  try {
    const modulesInfo = getModulesInfo();
    res.json({
      success: true,
      data: modulesInfo
    });
  } catch (error) {
    console.error("Error al obtener información de módulos:", error);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor"
    });
  }
});

/**
 * Obtener información de un módulo específico
 */
router.get("/:moduleId", async (req: Request, res: Response) => {
  try {
    const { moduleId } = req.params;
    const module = getModule(moduleId);
    
    if (!module) {
      return res.status(404).json({
        success: false,
        error: `Módulo ${moduleId} no encontrado`
      });
    }

    res.json({
      success: true,
      data: {
        id: module.config.id,
        name: module.config.name,
        version: module.config.version,
        description: module.config.description,
        status: module.getStatus(),
        enabled: module.config.enabled,
        ready: module.isReady()
      }
    });
  } catch (error) {
    console.error("Error al obtener información del módulo:", error);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor"
    });
  }
});

/**
 * Verificar el estado de salud de los módulos
 */
router.get("/health/check", async (req: Request, res: Response) => {
  try {
    const healthCheck = await getModulesHealthCheck();
    res.json({
      success: true,
      data: healthCheck
    });
  } catch (error) {
    console.error("Error al verificar salud de módulos:", error);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor"
    });
  }
});

/**
 * Habilitar un módulo
 */
router.post("/:moduleId/enable", async (req: Request, res: Response) => {
  try {
    const { moduleId } = req.params;
    await moduleManager.enableModule(moduleId);
    
    res.json({
      success: true,
      message: `Módulo ${moduleId} habilitado correctamente`
    });
  } catch (error) {
    console.error("Error al habilitar módulo:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Error interno del servidor"
    });
  }
});

/**
 * Deshabilitar un módulo
 */
router.post("/:moduleId/disable", async (req: Request, res: Response) => {
  try {
    const { moduleId } = req.params;
    await moduleManager.disableModule(moduleId);
    
    res.json({
      success: true,
      message: `Módulo ${moduleId} deshabilitado correctamente`
    });
  } catch (error) {
    console.error("Error al deshabilitar módulo:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Error interno del servidor"
    });
  }
});

/**
 * Obtener estadísticas de un módulo
 */
router.get("/:moduleId/stats", async (req: Request, res: Response) => {
  try {
    const { moduleId } = req.params;
    const module = getModule(moduleId);
    
    if (!module) {
      return res.status(404).json({
        success: false,
        error: `Módulo ${moduleId} no encontrado`
      });
    }

    // Verificar si el módulo tiene método getStats
    if (typeof (module as any).getStats === 'function') {
      const stats = await (module as any).getStats();
      res.json({
        success: true,
        data: stats
      });
    } else {
      res.json({
        success: true,
        data: {
          message: "El módulo no proporciona estadísticas detalladas",
          basicInfo: {
            status: module.getStatus(),
            enabled: module.config.enabled,
            ready: module.isReady()
          }
        }
      });
    }
  } catch (error) {
    console.error("Error al obtener estadísticas del módulo:", error);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor"
    });
  }
});

/**
 * Probar funcionalidad básica de un módulo
 */
router.post("/:moduleId/test", async (req: Request, res: Response) => {
  try {
    const { moduleId } = req.params;
    const module = getModule(moduleId);
    
    if (!module) {
      return res.status(404).json({
        success: false,
        error: `Módulo ${moduleId} no encontrado`
      });
    }

    if (!module.isReady()) {
      return res.status(400).json({
        success: false,
        error: `Módulo ${moduleId} no está listo`
      });
    }

    // Probar operaciones básicas del módulo
    const testResults = {
      moduleId,
      timestamp: new Date().toISOString(),
      tests: {
        serviceAvailable: !!module.service,
        controllerAvailable: !!module.controller,
        routerAvailable: false,
        reportTypesAvailable: false
      }
    };

    // Probar router
    try {
      const router = module.controller.getRouter();
      testResults.tests.routerAvailable = !!router;
    } catch (error) {
      console.warn(`Error al obtener router del módulo ${moduleId}:`, error);
    }

    // Probar tipos de reportes
    try {
      if (typeof module.service.getReportTypes === 'function') {
        const reportTypes = module.service.getReportTypes();
        testResults.tests.reportTypesAvailable = Array.isArray(reportTypes) && reportTypes.length > 0;
      }
    } catch (error) {
      console.warn(`Error al obtener tipos de reportes del módulo ${moduleId}:`, error);
    }

    res.json({
      success: true,
      data: testResults
    });
  } catch (error) {
    console.error("Error al probar módulo:", error);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor"
    });
  }
});

export default router;