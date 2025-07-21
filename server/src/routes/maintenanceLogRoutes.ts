import { Router } from "express";
import MaintenanceLog from "../models/MaintenanceLog.js";
import Vehicle from "../models/Vehicle.js";
import { authenticatePin } from "../middleware/auth.js";

const router = Router();

router.post("/:vehicleId/maintenance-logs", authenticatePin, async (req, res) => {
  const { vehicleId } = req.params;
  const { date, odometer, service, cost, notes } = req.body;

  if (!date || !odometer || !service || !cost) {
    return res
      .status(400)
      .json({ message: "Date, Odometer, Service, and Cost are required." });
  }

  try {
    const vehicle = await Vehicle.findByPk(vehicleId);
    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found." });
    }

    const maintenanceLog = await MaintenanceLog.create({
      vehicleId: parseInt(vehicleId),
      date,
      odometer,
      service,
      cost,
      notes,
    });
    res
      .status(201)
      .json({ id: maintenanceLog.id, message: "Maintenance log added successfully." });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error adding maintenance log.", error: error.message });
  }
});

router.get("/:vehicleId/maintenance-logs", authenticatePin, async (req, res) => {
  const { vehicleId } = req.params;
  try {
    const maintenanceLogs = await MaintenanceLog.findAll({
      where: { vehicleId: parseInt(vehicleId) },
      order: [
        ["date", "ASC"],
        ["odometer", "ASC"],
      ],
    });

    res.status(200).json(maintenanceLogs);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error fetching maintenance logs.", error: error.message });
  }
});

router.get("/maintenance-logs/:id", authenticatePin, async (req, res) => {
  const { id } = req.params;
  try {
    const maintenanceLog = await MaintenanceLog.findByPk(id);
    if (!maintenanceLog) {
      return res.status(404).json({ message: "Maintenance log not found." });
    }
    res.status(200).json(maintenanceLog);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error fetching maintenance log.", error: error.message });
  }
});

router.put("/maintenance-logs/:id", authenticatePin, async (req, res) => {
  const { id } = req.params;
  const { date, odometer, service, cost, notes } = req.body;

  if (!date || !odometer || !service || !cost) {
    return res
      .status(400)
      .json({ message: "Date, Odometer, Service, and Cost are required." });
  }

  try {
    const maintenanceLog = await MaintenanceLog.findByPk(id);
    if (!maintenanceLog) {
      return res.status(404).json({ message: "Maintenance log not found." });
    }

    await maintenanceLog.update({
      date,
      odometer,
      service,
      cost,
      notes,
    });
    res.status(200).json({ message: "Maintenance log updated successfully." });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error updating maintenance log.", error: error.message });
  }
});

router.delete("/maintenance-logs/:id", authenticatePin, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await MaintenanceLog.destroy({
      where: { id: id },
    });
    if (result === 0) {
      return res.status(404).json({ message: "Maintenance log not found." });
    }
    res.status(200).json({ message: "Maintenance log deleted successfully." });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error deleting maintenance log.", error: error.message });
  }
});

export default router;
