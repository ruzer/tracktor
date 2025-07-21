import { Router } from "express";
import Insurance from "../models/Insurance.js";
import Vehicle from "../models/Vehicle.js";
import { authenticatePin } from "../middleware/auth.js";
const router = Router();
router.post("/:vehicleId/insurance", authenticatePin, async (req, res) => {
    const { vehicleId } = req.params;
    const { provider, policyNumber, startDate, endDate, cost } = req.body;
    if (!provider || !policyNumber || !startDate || !endDate || !cost) {
        return res.status(400).json({
            message: "Provider, Policy Number, Start Date, End Date, and Cost are required.",
        });
    }
    try {
        const vehicle = await Vehicle.findByPk(vehicleId);
        if (!vehicle) {
            return res.status(404).json({ message: "Vehicle not found." });
        }
        const insurance = await Insurance.create({
            vehicleId: parseInt(vehicleId),
            provider,
            policyNumber,
            startDate,
            endDate,
            cost,
        });
        res
            .status(201)
            .json({ id: insurance.id, message: "Insurance details added successfully." });
    }
    catch (error) {
        if (error.name === "SequelizeUniqueConstraintError") {
            return res
                .status(409)
                .json({ message: "Insurance details already exist for this vehicle." });
        }
        res
            .status(500)
            .json({ message: "Error adding insurance details.", error: error.message });
    }
});
router.get("/:vehicleId/insurance", authenticatePin, async (req, res) => {
    const { vehicleId } = req.params;
    try {
        const insurance = await Insurance.findOne({
            where: { vehicleId: parseInt(vehicleId) },
        });
        if (!insurance) {
            return res.status(404).json({ message: "Insurance details not found." });
        }
        res.status(200).json(insurance);
    }
    catch (error) {
        res
            .status(500)
            .json({ message: "Error fetching insurance details.", error: error.message });
    }
});
router.put("/:vehicleId/insurance", authenticatePin, async (req, res) => {
    const { vehicleId } = req.params;
    const { provider, policyNumber, startDate, endDate, cost } = req.body;
    if (!provider || !policyNumber || !startDate || !endDate || !cost) {
        return res.status(400).json({
            message: "Provider, Policy Number, Start Date, End Date, and Cost are required.",
        });
    }
    try {
        const insurance = await Insurance.findOne({
            where: { vehicleId: parseInt(vehicleId) },
        });
        if (!insurance) {
            return res.status(404).json({ message: "Insurance details not found." });
        }
        await insurance.update({
            provider,
            policyNumber,
            startDate,
            endDate,
            cost,
        });
        res.status(200).json({ message: "Insurance details updated successfully." });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: "Error updating insurance details.", error: error.message });
    }
});
router.delete("/:vehicleId/insurance", authenticatePin, async (req, res) => {
    const { vehicleId } = req.params;
    try {
        const result = await Insurance.destroy({
            where: { vehicleId: parseInt(vehicleId) },
        });
        if (result === 0) {
            return res.status(404).json({ message: "Insurance details not found." });
        }
        res.status(200).json({ message: "Insurance details deleted successfully." });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: "Error deleting insurance details.", error: error.message });
    }
});
export default router;
//# sourceMappingURL=insuranceRoutes.js.map