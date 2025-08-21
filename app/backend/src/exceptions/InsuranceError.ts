import { ServiceError, Status } from "./ServiceError.js";

export class InsuranceError extends ServiceError {
  constructor(message: string, status = Status.INTERNAL_SERVER_ERROR) {
    super(InsuranceError.name, message, status);
  }
}
