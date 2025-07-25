export class PinError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PinError";
  }
}
