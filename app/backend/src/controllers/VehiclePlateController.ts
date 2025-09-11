import { Request, Response } from "express";
import * as plateService from "@services/vehiclePlateService.js";
import { Status } from "@exceptions/ServiceError.js";

export const listPlates = async (req: Request, res: Response) => {
  const { vehicleId } = req.params;
  if (!vehicleId) return res.status(Status.BAD_REQUEST).json({ message: "Vehicle ID is required" });
  const rows = await plateService.listPlates(vehicleId);
  res.json(rows);
};

export const addPlate = async (req: Request, res: Response) => {
  const { vehicleId } = req.params;
  const { plate, issuedDate, reason, isCurrent } = req.body;
  if (!vehicleId || !plate) return res.status(Status.BAD_REQUEST).json({ message: "Vehicle ID and plate are required" });
  const result = await plateService.addPlate(vehicleId, { plate, issuedDate, reason, isCurrent });
  res.status(201).json(result);
};

export const markCurrent = async (req: Request, res: Response) => {
  const { vehicleId, plateId } = req.params;
  const result = await plateService.markCurrent(vehicleId!, plateId!);
  res.json(result);
};

export const retirePlate = async (req: Request, res: Response) => {
  const { vehicleId, plateId } = req.params;
  const { retiredDate, reason } = req.body || {};
  const result = await plateService.retirePlate(vehicleId!, plateId!, { retiredDate, reason });
  res.json(result);
};

