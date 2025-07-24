export class PollutionCertificateNotFoundError extends Error {
  constructor(message = "Pollution certificate not found.") {
    super(message);
    this.name = "PollutionCertificateNotFoundError";
  }
}

export class PollutionCertificateExistsError extends Error {
  constructor(message = "Pollution certificate already exists for this vehicle or certificate number is not unique.") {
    super(message);
    this.name = "PollutionCertificateExistsError";
  }
}

export class PollutionCertificateServiceError extends Error {
  constructor(message = "Pollution certificate service error.") {
    super(message);
    this.name = "PollutionCertificateServiceError";
  }
}
