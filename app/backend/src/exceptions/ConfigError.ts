import { ServiceError, Status } from "./ServiceError.js";

export class ConfigError extends ServiceError {
  constructor(message: string, status = Status.INTERNAL_SERVER_ERROR) {
    super(ConfigError.name, message, status);
  }
}
