export class VehicleNotFoundError extends Error {
  constructor(message = "Vehicle not found.") {
    super(message);
    this.name = "VehicleNotFoundError";
  }
}

export class VehicleExistsError extends Error {
  constructor(message = "Vehicle with this license plate or VIN already exists.") {
    super(message);
    this.name = "VehicleExistsError";
  }
}

export class VehicleServiceError extends Error {
  constructor(message = "Vehicle service error.") {
    super(message);
    this.name = "VehicleServiceError";
  }
}