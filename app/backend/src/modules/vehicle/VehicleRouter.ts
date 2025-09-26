import { Router } from "express";
import { VehicleController } from "./VehicleController.js";

/**
 * Crear router para el módulo de vehículos
 */
export function createVehicleRouter(controller: VehicleController): Router {
  const router = Router();

  // ==================== RUTAS ESPECÍFICAS (DEBEN IR ANTES DE LAS RUTAS CON PARÁMETROS) ====================
  
  // Test del módulo
  router.get("/test", controller.test.bind(controller));
  
  // Obtener estadísticas
  router.get("/stats", controller.getStats.bind(controller));
  
  // Obtener tipos de reportes disponibles
  router.get("/reports", controller.getReportTypes.bind(controller));
  
  // Generar reporte específico
  router.get("/reports/:type", controller.generateReport.bind(controller));
  
  // Verificar disponibilidad de placa
  router.get("/check-plate/:licensePlate", controller.checkPlateAvailability.bind(controller));

  // ==================== RUTAS CRUD ====================
  
  // Crear vehículo
  router.post("/", controller.create.bind(controller));
  
  // Obtener todos los vehículos (con filtros opcionales)
  router.get("/", controller.getAll.bind(controller));
  
  // Obtener vehículo por ID
  router.get("/:id", controller.getById.bind(controller));
  
  // Actualizar vehículo
  router.put("/:id", controller.update.bind(controller));
  
  // Eliminar vehículo
  router.delete("/:id", controller.delete.bind(controller));

  return router;
}