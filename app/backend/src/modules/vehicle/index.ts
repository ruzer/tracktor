/**
 * Módulo de Vehículos
 * Exporta todos los componentes del módulo de vehículos
 */

export { VehicleModule } from "./VehicleModule.js";
export { VehicleService } from "./VehicleService.js";
export { VehicleController } from "./VehicleController.js";
export { createVehicleRouter } from "./VehicleRouter.js";

// Exportar tipos e interfaces
export type {
  VehicleRecord,
  CreateVehiclePayload,
  UpdateVehiclePayload,
  VehicleFilters
} from "./VehicleService.js";