import { Router } from "express";
import Vehicle from "../models/Vehicle.js";
import { authenticatePin } from "../middleware/auth.js";

const router = Router();

router.post("/", authenticatePin, async (req, res) => {
  const { make, model, year, licensePlate, vin, color, odometer } = req.body;

  if (!make || !model || !year || !licensePlate) {
    return res
      .status(400)
      .json({ message: "Make, Model, Year, and License Plate are required." });
  }

  try {
    const vehicle = await Vehicle.create({
      make,
      model,
      year,
      licensePlate,
      vin,
      color,
      odometer,
    });
    res
      .status(201)
      .json({ id: vehicle.id, message: "Vehicle added successfully." });
  } catch (error: any) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res
        .status(409)
        .json({
          message: "Vehicle with this license plate or VIN already exists.",
        });
    }
    res
      .status(500)
      .json({ message: "Error adding vehicle.", error: error.message });
  }
});

router.get("/", authenticatePin, async (req, res) => {
  try {
    const vehicles = await Vehicle.findAll();
    res.status(200).json(vehicles);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error fetching vehicles.", error: error.message });
  }
});

router.get("/:id", authenticatePin, async (req, res) => {
  const { id } = req.params;
  try {
    const vehicle = await Vehicle.findByPk(id);
    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found." });
    }
    res.status(200).json(vehicle);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error fetching vehicle.", error: error.message });
  }
});

router.put("/:id", authenticatePin, async (req, res) => {
  const { id } = req.params;
  const { make, model, year, licensePlate, vin, color, odometer } = req.body;

  if (!make || !model || !year || !licensePlate) {
    return res
      .status(400)
      .json({ message: "Make, Model, Year, and License Plate are required." });
  }

  try {
    const vehicle = await Vehicle.findByPk(id);
    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found." });
    }

    await vehicle.update({
      make,
      model,
      year,
      licensePlate,
      vin,
      color,
      odometer,
    });
    res.status(200).json({ message: "Vehicle updated successfully." });
  } catch (error: any) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res
        .status(409)
        .json({
          message: "Vehicle with this license plate or VIN already exists.",
        });
    }
    res
      .status(500)
      .json({ message: "Error updating vehicle.", error: error.message });
  }
});

router.delete("/:id", authenticatePin, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await Vehicle.destroy({
      where: { id: id },
    });
    if (result === 0) {
      return res.status(404).json({ message: "Vehicle not found." });
    }
    res.status(200).json({ message: "Vehicle deleted successfully." });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error deleting vehicle.", error: error.message });
  }
});

export default router;
