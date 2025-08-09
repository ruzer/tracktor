import { Request, Response } from "express";
import * as insuranceService from "../services/insuranceService.js";
import { InsuranceError } from "../exceptions/InsuranceError.js";
import { Status } from "../exceptions/ServiceError.js";

export const addInsurance = async (req: Request, res: Response) => {
  try {
    const { vehicleId } = req.params;
    const { provider, policyNumber, startDate, endDate, cost } = req.body;

    if (!vehicleId) {
      throw new InsuranceError("Vehicle ID is required.", Status.BAD_REQUEST);
    }
    if (!provider || !policyNumber || !startDate || !endDate || !cost) {
      throw new InsuranceError(
        "Provider, Policy Number, Start Date, End Date, and Cost are required.",
        Status.BAD_REQUEST,
      );
    }
    const result = await insuranceService.addInsurance(vehicleId, req.body);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(error.status.valueOf()).json({ message: error.message });
  }
};

export const getInsurances = async (req: Request, res: Response) => {
  try {
    const { vehicleId } = req.params;
    if (!vehicleId) {
      throw new InsuranceError("Vehicle ID is required.", Status.BAD_REQUEST);
    }
    const insurances = await insuranceService.getInsurances(vehicleId);
    res.status(200).json(insurances);
  } catch (error: any) {
    res.status(error.status.valueOf()).json({ message: error.message });
  }
};

export const updateInsurance = async (req: Request, res: Response) => {
  try {
    const { vehicleId, id } = req.params;
    const { provider, policyNumber, startDate, endDate, cost } = req.body;

    if (!vehicleId || !id) {
      throw new InsuranceError(
        "Vehicle ID and Insurance Id is required.",
        Status.BAD_REQUEST,
      );
    }
    if (!provider || !policyNumber || !startDate || !endDate || !cost) {
      throw new InsuranceError(
        "Provider, Policy Number, Start Date, End Date, and Cost are required.",
        Status.BAD_REQUEST,
      );
    }
    const result = await insuranceService.updateInsurance(
      vehicleId,
      id,
      req.body,
    );
    res.status(200).json(result);
  } catch (error: any) {
    res.status(error.status.valueOf()).json({ message: error.message });
  }
};

export const deleteInsurance = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new InsuranceError("Insurance ID is required.", Status.BAD_REQUEST);
    }
    const result = await insuranceService.deleteInsurance(id);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(error.status.valueOf()).json({ message: error.message });
  }
};
