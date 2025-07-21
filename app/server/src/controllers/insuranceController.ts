
import { Request, Response } from "express";
import * as insuranceService from "../services/insuranceService.js";

export const addInsurance = async (req: Request, res: Response) => {
  const { vehicleId } = req.params;
  const { provider, policyNumber, startDate, endDate, cost } = req.body;

  if (!provider || !policyNumber || !startDate || !endDate || !cost) {
    return res.status(400).json({
      message: "Provider, Policy Number, Start Date, End Date, and Cost are required.",
    });
  }

  try {
    const result = await insuranceService.addInsurance(vehicleId, req.body);
    res.status(201).json(result);
  } catch (error: any) {
    if (error.message === "Vehicle not found.") {
      return res.status(404).json({ message: error.message });
    }
    if (error.message === "Insurance details already exist for this vehicle.") {
      return res.status(409).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

export const getInsurance = async (req: Request, res: Response) => {
  const { vehicleId } = req.params;
  try {
    const insurance = await insuranceService.getInsurance(vehicleId);
    res.status(200).json(insurance);
  } catch (error: any) {
    if (error.message === "Insurance details not found.") {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

export const updateInsurance = async (req: Request, res: Response) => {
  const { vehicleId } = req.params;
  const { provider, policyNumber, startDate, endDate, cost } = req.body;

  if (!provider || !policyNumber || !startDate || !endDate || !cost) {
    return res.status(400).json({
      message: "Provider, Policy Number, Start Date, End Date, and Cost are required.",
    });
  }

  try {
    const result = await insuranceService.updateInsurance(vehicleId, req.body);
    res.status(200).json(result);
  } catch (error: any) {
    if (error.message === "Insurance details not found.") {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

export const deleteInsurance = async (req: Request, res: Response) => {
  const { vehicleId } = req.params;
  try {
    const result = await insuranceService.deleteInsurance(vehicleId);
    res.status(200).json(result);
  } catch (error: any) {
    if (error.message === "Insurance details not found.") {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};
