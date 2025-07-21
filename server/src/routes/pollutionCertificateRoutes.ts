import { Router } from "express";
import PollutionCertificate from "../models/PollutionCertificate.js";
import Vehicle from "../models/Vehicle.js";
import { authenticatePin } from "../middleware/auth.js";

const router = Router();

router.post("/:vehicleId/pollution-certificate", authenticatePin, async (req, res) => {
  const { vehicleId } = req.params;
  const { certificateNumber, issueDate, expiryDate, testingCenter, notes } = req.body;

  if (!certificateNumber || !issueDate || !expiryDate || !testingCenter) {
    return res.status(400).json({
      message: "Certificate Number, Issue Date, Expiry Date, and Testing Center are required.",
    });
  }

  try {
    const vehicle = await Vehicle.findByPk(vehicleId);
    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found." });
    }

    const pollutionCertificate = await PollutionCertificate.create({
      vehicleId: parseInt(vehicleId),
      certificateNumber,
      issueDate,
      expiryDate,
      testingCenter,
      notes,
    });
    res
      .status(201)
      .json({ id: pollutionCertificate.id, message: "Pollution certificate added successfully." });
  } catch (error: any) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res
        .status(409)
        .json({ message: "Pollution certificate already exists for this vehicle or certificate number is not unique." });
    }
    res
      .status(500)
      .json({ message: "Error adding pollution certificate.", error: error.message });
  }
});

router.get("/:vehicleId/pollution-certificate", authenticatePin, async (req, res) => {
  const { vehicleId } = req.params;
  try {
    const pollutionCertificate = await PollutionCertificate.findOne({
      where: { vehicleId: parseInt(vehicleId) },
    });
    if (!pollutionCertificate) {
      return res.status(404).json({ message: "Pollution certificate not found." });
    }
    res.status(200).json(pollutionCertificate);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error fetching pollution certificate.", error: error.message });
  }
});

router.put("/:vehicleId/pollution-certificate", authenticatePin, async (req, res) => {
  const { vehicleId } = req.params;
  const { certificateNumber, issueDate, expiryDate, testingCenter, notes } = req.body;

  if (!certificateNumber || !issueDate || !expiryDate || !testingCenter) {
    return res.status(400).json({
      message: "Certificate Number, Issue Date, Expiry Date, and Testing Center are required.",
    });
  }

  try {
    const pollutionCertificate = await PollutionCertificate.findOne({
      where: { vehicleId: parseInt(vehicleId) },
    });
    if (!pollutionCertificate) {
      return res.status(404).json({ message: "Pollution certificate not found." });
    }

    await pollutionCertificate.update({
      certificateNumber,
      issueDate,
      expiryDate,
      testingCenter,
      notes,
    });
    res.status(200).json({ message: "Pollution certificate updated successfully." });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error updating pollution certificate.", error: error.message });
  }
});

router.delete("/:vehicleId/pollution-certificate", authenticatePin, async (req, res) => {
  const { vehicleId } = req.params;
  try {
    const result = await PollutionCertificate.destroy({
      where: { vehicleId: parseInt(vehicleId) },
    });
    if (result === 0) {
      return res.status(404).json({ message: "Pollution certificate not found." });
    }
    res.status(200).json({ message: "Pollution certificate deleted successfully." });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error deleting pollution certificate.", error: error.message });
  }
});

export default router;
