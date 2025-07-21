
import { Request, Response } from "express";
import * as pollutionCertificateService from "../services/pollutionCertificateService.js";

export const addPollutionCertificate = async (req: Request, res: Response) => {
  const { vehicleId } = req.params;
  const { certificateNumber, issueDate, expiryDate, testingCenter, notes } = req.body;

  if (!certificateNumber || !issueDate || !expiryDate || !testingCenter) {
    return res.status(400).json({
      message: "Certificate Number, Issue Date, Expiry Date, and Testing Center are required.",
    });
  }

  try {
    const result = await pollutionCertificateService.addPollutionCertificate(
      vehicleId,
      req.body
    );
    res.status(201).json(result);
  } catch (error: any) {
    if (error.message === "Vehicle not found.") {
      return res.status(404).json({ message: error.message });
    }
    if (error.message === "Pollution certificate already exists for this vehicle or certificate number is not unique.") {
      return res.status(409).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

export const getPollutionCertificate = async (req: Request, res: Response) => {
  const { vehicleId } = req.params;
  try {
    const pollutionCertificate = await pollutionCertificateService.getPollutionCertificate(
      vehicleId
    );
    res.status(200).json(pollutionCertificate);
  } catch (error: any) {
    if (error.message === "Pollution certificate not found.") {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

export const updatePollutionCertificate = async (req: Request, res: Response) => {
  const { vehicleId } = req.params;
  const { certificateNumber, issueDate, expiryDate, testingCenter, notes } = req.body;

  if (!certificateNumber || !issueDate || !expiryDate || !testingCenter) {
    return res.status(400).json({
      message: "Certificate Number, Issue Date, Expiry Date, and Testing Center are required.",
    });
  }

  try {
    const result = await pollutionCertificateService.updatePollutionCertificate(
      vehicleId,
      req.body
    );
    res.status(200).json(result);
  } catch (error: any) {
    if (error.message === "Pollution certificate not found.") {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

export const deletePollutionCertificate = async (req: Request, res: Response) => {
  const { vehicleId } = req.params;
  try {
    const result = await pollutionCertificateService.deletePollutionCertificate(
      vehicleId
    );
    res.status(200).json(result);
  } catch (error: any) {
    if (error.message === "Pollution certificate not found.") {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};
