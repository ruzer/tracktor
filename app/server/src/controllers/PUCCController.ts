import { Request, Response } from "express";
import * as pollutionCertificateService from "../services/pollutionCertificateService.js";
import {
  PollutionCertificateNotFoundError,
  PollutionCertificateExistsError,
  PollutionCertificateServiceError,
} from "../exceptions/PollutionCertificateErrors.js";

export const addPollutionCertificate = async (req: Request, res: Response) => {
  const { vehicleId } = req.params;
  const { certificateNumber, issueDate, expiryDate, testingCenter, notes } =
    req.body;

  if (!vehicleId) {
    return res.status(400).json({ message: "Vehicle ID is required." });
  }
  if (!certificateNumber || !issueDate || !expiryDate || !testingCenter) {
    return res.status(400).json({
      message:
        "Certificate Number, Issue Date, Expiry Date, and Testing Center are required.",
    });
  }

  try {
    const result = await pollutionCertificateService.addPollutionCertificate(
      vehicleId,
      req.body,
    );
    res.status(201).json(result);
  } catch (error: any) {
    if (error instanceof PollutionCertificateNotFoundError) {
      return res.status(404).json({ message: error.message });
    }
    if (error instanceof PollutionCertificateExistsError) {
      return res.status(409).json({ message: error.message });
    }
    if (error instanceof PollutionCertificateServiceError) {
      return res.status(500).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

export const getPollutionCertificates = async (req: Request, res: Response) => {
  const { vehicleId } = req.params;
  if (!vehicleId) {
    return res.status(400).json({ message: "Vehicle ID is required." });
  }
  try {
    const pollutionCertificates =
      await pollutionCertificateService.getPollutionCertificates(vehicleId);
    res.status(200).json(pollutionCertificates);
  } catch (error: any) {
    if (error instanceof PollutionCertificateNotFoundError) {
      return res.status(404).json({ message: error.message });
    }
    if (error instanceof PollutionCertificateServiceError) {
      return res.status(500).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

export const updatePollutionCertificate = async (
  req: Request,
  res: Response,
) => {
  const { vehicleId, id } = req.params;
  const { certificateNumber, issueDate, expiryDate, testingCenter, notes } =
    req.body;

  if (!vehicleId || !id) {
    return res
      .status(400)
      .json({ message: "Vehicle ID and certificate ID are required." });
  }
  if (!certificateNumber || !issueDate || !expiryDate || !testingCenter) {
    return res.status(400).json({
      message:
        "Certificate Number, Issue Date, Expiry Date, and Testing Center are required.",
    });
  }

  try {
    const result = await pollutionCertificateService.updatePollutionCertificate(
      vehicleId,
      id,
      req.body,
    );
    res.status(200).json(result);
  } catch (error: any) {
    if (error instanceof PollutionCertificateNotFoundError) {
      return res.status(404).json({ message: error.message });
    }
    if (error instanceof PollutionCertificateServiceError) {
      return res.status(500).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

export const deletePollutionCertificate = async (
  req: Request,
  res: Response,
) => {
  const { vehicleId } = req.params;
  if (!vehicleId) {
    return res.status(400).json({ message: "Vehicle ID is required." });
  }
  try {
    const result =
      await pollutionCertificateService.deletePollutionCertificate(vehicleId);
    res.status(200).json(result);
  } catch (error: any) {
    if (error instanceof PollutionCertificateNotFoundError) {
      return res.status(404).json({ message: error.message });
    }
    if (error instanceof PollutionCertificateServiceError) {
      return res.status(500).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};
