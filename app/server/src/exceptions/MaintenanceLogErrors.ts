export class MaintenanceLogNotFoundError extends Error {
  constructor(message = "Maintenance log not found.") {
    super(message);
    this.name = "MaintenanceLogNotFoundError";
  }
}

export class MaintenanceLogServiceError extends Error {
  constructor(message = "Maintenance log service error.") {
    super(message);
    this.name = "MaintenanceLogServiceError";
  }
}
