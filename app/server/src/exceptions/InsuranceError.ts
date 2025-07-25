export class InsuranceNotFoundError extends Error {
  constructor(message = "Insurance details not found.") {
    super(message);
    this.name = "InsuranceNotFoundError";
  }
}

export class InsuranceExistsError extends Error {
  constructor(message = "Insurance details already exist for this vehicle.") {
    super(message);
    this.name = "InsuranceExistsError";
  }
}

export class InsuranceServiceError extends Error {
  constructor(message = "Insurance service error.") {
    super(message);
    this.name = "InsuranceServiceError";
  }
}