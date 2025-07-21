import { Router } from "express";
import FuelLog from "../models/FuelLog.js";
import Vehicle from "../models/Vehicle.js";
import { authenticatePin } from "../middleware/auth.js";
const router = Router();
router.post("/:vehicleId/fuel-logs", authenticatePin, async (req, res) => {
    const { vehicleId } = req.params;
    const { date, odometer, fuelAmount, cost, notes } = req.body;
    if (!date || !odometer || !fuelAmount || !cost) {
        return res
            .status(400)
            .json({ message: "Date, Odometer, Fuel Amount, and Cost are required." });
    }
    try {
        const vehicle = await Vehicle.findByPk(vehicleId);
        if (!vehicle) {
            return res.status(404).json({ message: "Vehicle not found." });
        }
        const fuelLog = await FuelLog.create({
            vehicleId: parseInt(vehicleId),
            date,
            odometer,
            fuelAmount,
            cost,
            notes,
        });
        res
            .status(201)
            .json({ id: fuelLog.id, message: "Fuel log added successfully." });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: "Error adding fuel log.", error: error.message });
    }
});
router.get("/:vehicleId/fuel-logs", authenticatePin, async (req, res) => {
    const { vehicleId } = req.params;
    try {
        const fuelLogs = await FuelLog.findAll({
            where: { vehicleId: parseInt(vehicleId) },
            order: [
                ["date", "ASC"],
                ["odometer", "ASC"],
            ],
        });
        // Calculate mileage
        const fuelLogsWithMileage = fuelLogs.map((log, index, arr) => {
            if (index > 0) {
                const prevLog = arr[index - 1];
                const distance = log.odometer - prevLog.odometer;
                const mileage = distance / log.fuelAmount; // km/L or miles/gallon
                return { ...log.toJSON(), mileage: parseFloat(mileage.toFixed(2)) };
            }
            return { ...log.toJSON(), mileage: null };
        });
        res.status(200).json(fuelLogsWithMileage);
    }
    catch (error) {
        res
            .status(500)
            .json({ message: "Error fetching fuel logs.", error: error.message });
    }
});
router.get("/fuel-logs/:id", authenticatePin, async (req, res) => {
    const { id } = req.params;
    try {
        const fuelLog = await FuelLog.findByPk(id);
        if (!fuelLog) {
            return res.status(404).json({ message: "Fuel log not found." });
        }
        res.status(200).json(fuelLog);
    }
    catch (error) {
        res
            .status(500)
            .json({ message: "Error fetching fuel log.", error: error.message });
    }
});
router.put("/fuel-logs/:id", authenticatePin, async (req, res) => {
    const { id } = req.params;
    const { date, odometer, fuelAmount, cost, notes } = req.body;
    if (!date || !odometer || !fuelAmount || !cost) {
        return res
            .status(400)
            .json({ message: "Date, Odometer, Fuel Amount, and Cost are required." });
    }
    try {
        const fuelLog = await FuelLog.findByPk(id);
        if (!fuelLog) {
            return res.status(404).json({ message: "Fuel log not found." });
        }
        await fuelLog.update({
            date,
            odometer,
            fuelAmount,
            cost,
            notes,
        });
        res.status(200).json({ message: "Fuel log updated successfully." });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: "Error updating fuel log.", error: error.message });
    }
});
router.delete("/fuel-logs/:id", authenticatePin, async (req, res) => {
    const { id } = req.params;
    try {
        const result = await FuelLog.destroy({
            where: { id: id },
        });
        if (result === 0) {
            return res.status(404).json({ message: "Fuel log not found." });
        }
        res.status(200).json({ message: "Fuel log deleted successfully." });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: "Error deleting fuel log.", error: error.message });
    }
});
export default router;
//# sourceMappingURL=fuelLogRoutes.js.map