import { ServiceError, Status } from "./ServiceError.js";

export class VehicleError extends ServiceError {
  constructor(message: string, status = Status.INTERNAL_SERVER_ERROR) {
    super(VehicleError.name, message, status);
  }
}
