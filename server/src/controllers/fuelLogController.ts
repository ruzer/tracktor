
import { Request, Response } from "express";
import * as fuelLogService from "../services/fuelLogService.js";

export const addFuelLog = async (req: Request, res: Response) => {
  const { vehicleId } = req.params;
  const { date, odometer, fuelAmount, cost, notes } = req.body;

  if (!date || !odometer || !fuelAmount || !cost) {
    return res
      .status(400)
      .json({ message: "Date, Odometer, Fuel Amount, and Cost are required." });
  }

  try {
    const result = await fuelLogService.addFuelLog(vehicleId, req.body);
    res.status(201).json(result);
  } catch (error: any) {
    if (error.message === "Vehicle not found.") {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

export const getFuelLogs = async (req: Request, res: Response) => {
  const { vehicleId } = req.params;
  try {
    const fuelLogs = await fuelLogService.getFuelLogs(vehicleId);
    res.status(200).json(fuelLogs);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getFuelLogById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const fuelLog = await fuelLogService.getFuelLogById(id);
    res.status(200).json(fuelLog);
  } catch (error: any) {
    if (error.message === "Fuel log not found.") {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

export const updateFuelLog = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { date, odometer, fuelAmount, cost, notes } = req.body;

  if (!date || !odometer || !fuelAmount || !cost) {
    return res
      .status(400)
      .json({ message: "Date, Odometer, Fuel Amount, and Cost are required." });
  }

  try {
    const result = await fuelLogService.updateFuelLog(id, req.body);
    res.status(200).json(result);
  } catch (error: any) {
    if (error.message === "Fuel log not found.") {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

export const deleteFuelLog = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await fuelLogService.deleteFuelLog(id);
    res.status(200).json(result);
  } catch (error: any) {
    if (error.message === "Fuel log not found.") {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};
