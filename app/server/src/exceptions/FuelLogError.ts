export class FuelLogError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "FuelLogError";
    }
}

export class FuelLogNotFoundError extends Error {
    constructor() {
        super("Fuel log not found.");
        this.name = "FuelLogNotFoundError";
    }
}