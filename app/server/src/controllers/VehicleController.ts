
import { Request, Response } from "express";
import * as vehicleService from "../services/vehicleService.js";
import { VehicleNotFoundError } from "../exceptions/VehicleErrors.js";

export const addVehicle = async (req: Request, res: Response) => {
  const { vehicleType, make, model, year, licensePlate } = req.body;

  if (!vehicleType || !make || !model || !year || !licensePlate) {
    return res
      .status(400)
      .json({ message: "Make, Model, Year, and License Plate are required." });
  }

  try {
    const result = await vehicleService.addVehicle(req.body);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllVehicles = async (req: Request, res: Response) => {
  try {
    const vehicles = await vehicleService.getAllVehicles();
    res.status(200).json(vehicles);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getVehicleById = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "Vehicle ID is required." });
  }
  try {
    const vehicle = await vehicleService.getVehicleById(id);
    res.status(200).json(vehicle);
  } catch (error: any) {
    if (error instanceof VehicleNotFoundError) {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

export const updateVehicle = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { make, model, year, licensePlate } = req.body;

  if (!make || !model || !year || !licensePlate) {
    return res
      .status(400)
      .json({ message: "Make, Model, Year, and License Plate are required." });
  }
  if (!id) {
    return res
      .status(400)
      .json({ message: "Vehicle ID is required." });
  }
  try {
    const result = await vehicleService.updateVehicle(id, req.body);
    res.status(200).json(result);
  } catch (error: any) {
    if (error instanceof VehicleNotFoundError) {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

export const deleteVehicle = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "Vehicle ID is required." });
  }
  try {
    const result = await vehicleService.deleteVehicle(id);
    res.status(200).json(result);
  } catch (error: any) {
    if (error instanceof VehicleNotFoundError) {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};
