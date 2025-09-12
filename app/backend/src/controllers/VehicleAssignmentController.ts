import { Request, Response } from "express";
import * as svc from "@services/vehicleAssignmentService.js";
import { Status } from "@exceptions/ServiceError.js";

export const listAssignments = async (req: Request, res: Response) => {
  const { vehicleId } = req.params;
  if (!vehicleId)
    return res
      .status(Status.BAD_REQUEST)
      .json({ message: "Vehicle ID is required" });
  const rows = await svc.listAssignments(vehicleId);
  res.json(rows);
};

export const addAssignment = async (req: Request, res: Response) => {
  const { vehicleId } = req.params;
  const { startDate } = req.body || {};
  if (!vehicleId || !startDate)
    return res
      .status(Status.BAD_REQUEST)
      .json({ message: "Vehicle ID and startDate are required" });
  const result = await svc.addAssignment(vehicleId, req.body);
  res.status(201).json(result);
};

export const closeAssignment = async (req: Request, res: Response) => {
  const { vehicleId, assignmentId } = req.params;
  const { endDate } = req.body || {};
  const result = await svc.closeAssignment(vehicleId!, assignmentId!, endDate);
  res.json(result);
};
