import { Request, Response } from "express";
import * as maintenanceLogService from "../services/maintenanceLogService.js";
import {
  MaintenanceLogNotFoundError,
  MaintenanceLogServiceError
} from "../exceptions/MaintenanceLogErrors.js";

export const addMaintenanceLog = async (req: Request, res: Response) => {
  const { vehicleId } = req.params;
  const { date, odometer, service, cost } = req.body;

  if (!vehicleId) {
    return res.status(400).json({ message: "Vehicle ID is required." });
  }
  if (!date || !odometer || !service || !cost) {
    return res
      .status(400)
      .json({ message: "Date, Odometer, Service, and Cost are required." });
  }

  try {
    const result = await maintenanceLogService.addMaintenanceLog(
      vehicleId,
      req.body
    );
    res.status(201).json(result);
  } catch (error: any) {
    if (error instanceof MaintenanceLogNotFoundError) {
      return res.status(404).json({ message: error.message });
    }
    if (error instanceof MaintenanceLogServiceError) {
      return res.status(500).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

export const getMaintenanceLogs = async (req: Request, res: Response) => {
  const { vehicleId } = req.params;
  if (!vehicleId) {
    return res.status(400).json({ message: "Vehicle ID is required." });
  }
  try {
    const maintenanceLogs = await maintenanceLogService.getMaintenanceLogs(
      vehicleId
    );
    res.status(200).json(maintenanceLogs);
  } catch (error: any) {
    if (error instanceof MaintenanceLogServiceError) {
      return res.status(500).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

export const getMaintenanceLogById = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "Maintenance Log ID is required." });
  }
  try {
    const maintenanceLog = await maintenanceLogService.getMaintenanceLogById(id);
    res.status(200).json(maintenanceLog);
  } catch (error: any) {
    if (error instanceof MaintenanceLogNotFoundError) {
      return res.status(404).json({ message: error.message });
    }
    if (error instanceof MaintenanceLogServiceError) {
      return res.status(500).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

export const updateMaintenanceLog = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { date, odometer, service, cost, notes } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Maintenance Log ID is required." });
  }
  if (!date || !odometer || !service || !cost) {
    return res
      .status(400)
      .json({ message: "Date, Odometer, Service, and Cost are required." });
  }

  try {
    const result = await maintenanceLogService.updateMaintenanceLog(id, req.body);
    res.status(200).json(result);
  } catch (error: any) {
    if (error instanceof MaintenanceLogNotFoundError) {
      return res.status(404).json({ message: error.message });
    }
    if (error instanceof MaintenanceLogServiceError) {
      return res.status(500).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

export const deleteMaintenanceLog = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "Maintenance Log ID is required." });
  }
  try {
    const result = await maintenanceLogService.deleteMaintenanceLog(id);
    res.status(200).json(result);
  } catch (error: any) {
    if (error instanceof MaintenanceLogNotFoundError) {
      return res.status(404).json({ message: error.message });
    }
    if (error instanceof MaintenanceLogServiceError) {
      return res.status(500).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};
