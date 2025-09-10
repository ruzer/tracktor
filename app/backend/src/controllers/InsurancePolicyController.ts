import { Request, Response } from "express";
import * as svc from "@services/insurancePolicyService.js";
import { Status } from "@exceptions/ServiceError.js";

export const createPolicy = async (req: Request, res: Response) => {
  const { type, provider, policyNumber, startDate, endDate } = req.body || {};
  if (!type || !provider || !policyNumber || !startDate || !endDate) return res.status(Status.BAD_REQUEST).json({ message: 'Missing required fields' });
  const result = await svc.createPolicy(req.body);
  res.status(201).json(result);
};

export const listPolicies = async (_req: Request, res: Response) => {
  const rows = await svc.listPolicies();
  res.json(rows);
};

export const getPolicy = async (req: Request, res: Response) => {
  const { id } = req.params;
  const row = await svc.getPolicy(id!);
  if (!row) return res.status(Status.NOT_FOUND).json({ message: 'Policy not found' });
  res.json(row);
};

export const assignVehicles = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { vehicleIds } = req.body || {};
  if (!Array.isArray(vehicleIds) || vehicleIds.length === 0) return res.status(Status.BAD_REQUEST).json({ message: 'vehicleIds[] required' });
  const result = await svc.assignVehicles(id!, vehicleIds);
  res.json(result);
};

export const removeVehicle = async (req: Request, res: Response) => {
  const { id, vehicleId } = req.params;
  const result = await svc.removeVehicle(id!, vehicleId!);
  res.json(result);
};

export const listPolicyVehicles = async (req: Request, res: Response) => {
  const { id } = req.params;
  const rows = await svc.listPolicyVehicles(id!);
  res.json(rows);
};

