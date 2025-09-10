import { Request, Response } from "express";
import * as svc from "@services/vehicleTaxService.js";
import { Status } from "@exceptions/ServiceError.js";

export const listTaxes = async (req: Request, res: Response) => {
  const { vehicleId } = req.params;
  if (!vehicleId) return res.status(Status.BAD_REQUEST).json({ message: "Vehicle ID is required" });
  const rows = await svc.listTaxes(vehicleId);
  res.json(rows);
};

export const upsertTax = async (req: Request, res: Response) => {
  const { vehicleId } = req.params;
  const { type, year } = req.body || {};
  if (!vehicleId || !type || typeof year !== 'number') return res.status(Status.BAD_REQUEST).json({ message: "Vehicle ID, type and year are required" });
  const result = await svc.upsertTax(vehicleId, req.body);
  res.status(201).json(result);
};

export const markPaid = async (req: Request, res: Response) => {
  const { vehicleId, id } = req.params;
  const { paidDate } = req.body || {};
  const result = await svc.markPaid(vehicleId!, id!, paidDate);
  res.json(result);
};

