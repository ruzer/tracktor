
import { Request, Response } from "express";
import * as fuelLogService from "../services/fuelLogService.js";
import { VehicleNotFoundError } from "../exceptions/VehicleErrors.js";
import { FuelLogNotFoundError } from "../exceptions/FuelLogError.js";

export const addFuelLog = async (req: Request, res: Response) => {
  const { vehicleId } = req.params;
  const { date, odometer, fuelAmount, cost } = req.body;

  if (!date || !odometer || !fuelAmount || !cost) {
    return res
      .status(400)
      .json({ message: "Date, Odometer, Fuel Amount, and Cost are required." });
  }
  if (!vehicleId) {
    console.log("Vehicle ID is missing in request parameters.", JSON.stringify(req.path));
    return res
      .status(400)
      .json({ message: "Vehicle ID is required." });
  }

  try {
    const result = await fuelLogService.addFuelLog(vehicleId, req.body);
    res.status(201).json(result);
  } catch (error: any) {
    console.error("Error adding fuel log:", error);
    if (error instanceof VehicleNotFoundError) {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

export const getFuelLogs = async (req: Request, res: Response) => {
  const { vehicleId } = req.params;
  if (!vehicleId) {
    return res
      .status(400)
      .json({ message: "Vehicle ID is required." });
  }
  try {
    const fuelLogs = await fuelLogService.getFuelLogs(vehicleId);
    res.status(200).json(fuelLogs);
  } catch (error: any) {
    console.error("Error fetching fuel logs:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getFuelLogById = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    return res
      .status(400)
      .json({ message: "Fuel log ID is required." });
  }
  try {
    const fuelLog = await fuelLogService.getFuelLogById(id);
    res.status(200).json(fuelLog);
  } catch (error: any) {
    if (error instanceof FuelLogNotFoundError) {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

export const updateFuelLog = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { date, odometer, fuelAmount, cost } = req.body;

  if (!date || !odometer || !fuelAmount || !cost) {
    return res
      .status(400)
      .json({ message: "Date, Odometer, Fuel Amount, and Cost are required." });
  }
  if (!id) {
    return res
      .status(400)
      .json({ message: "Fuel log ID is required." });
  }
  try {
    const result = await fuelLogService.updateFuelLog(id, req.body);
    res.status(200).json(result);
  } catch (error: any) {
    console.error("Error updating fuel log:", error);
    if (error instanceof FuelLogNotFoundError) {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

export const deleteFuelLog = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    return res
      .status(400)
      .json({ message: "Fuel log ID is required." });
  }
  try {
    const result = await fuelLogService.deleteFuelLog(id);
    res.status(200).json(result);
  } catch (error: any) {
    console.error("Error deleting fuel log:", error);
    if (error instanceof FuelLogNotFoundError) {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};
