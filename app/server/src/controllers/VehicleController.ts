import { Request, Response } from "express";
import * as vehicleService from "../services/vehicleService.js";
import { VehicleError } from "../exceptions/VehicleError.js";
import { Status } from "../exceptions/ServiceError.js";

export const addVehicle = async (req: Request, res: Response) => {
  try {
    const { make, model, year, licensePlate } = req.body;
    if (!make || !model || !year || !licensePlate) {
      new VehicleError(
        "Make, Model, Year, and License Plate are required.",
        Status.BAD_REQUEST,
      );
    }
    const result = await vehicleService.addVehicle(req.body);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(error.status.valueOf()).json({ message: error.message });
  }
};

export const getAllVehicles = async (req: Request, res: Response) => {
  try {
    const vehicles = await vehicleService.getAllVehicles();
    res.status(200).json(vehicles);
  } catch (error: any) {
    res.status(error.status.valueOf()).json({ message: error.message });
  }
};

export const getVehicleById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new VehicleError("Vehicle ID is required.", Status.BAD_REQUEST);
    }
    const vehicle = await vehicleService.getVehicleById(id);
    res.status(200).json(vehicle);
  } catch (error: any) {
    res.status(error.status.valueOf()).json({ message: error.message });
  }
};

export const updateVehicle = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { make, model, year, licensePlate } = req.body;

    if (!make || !model || !year || !licensePlate) {
      throw new VehicleError(
        "Make, Model, Year, and License Plate are required.",
        Status.BAD_REQUEST,
      );
    }
    if (!id) {
      throw new VehicleError("Vehicle ID is required.", Status.BAD_REQUEST);
    }
    const result = await vehicleService.updateVehicle(id, req.body);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(error.status.valueOf()).json({ message: error.message });
  }
};

export const deleteVehicle = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new VehicleError("Vehicle ID is required.", Status.BAD_REQUEST);
    }

    const result = await vehicleService.deleteVehicle(id);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(error.status.valueOf()).json({ message: error.message });
  }
};
