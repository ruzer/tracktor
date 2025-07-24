import { Router } from "express";
import {
  addFuelLog,
  getFuelLogs,
  getFuelLogById,
  updateFuelLog,
  deleteFuelLog,
} from "../controllers/FuelLogController.js";
import { authenticatePin } from "../middleware/auth.js";

const router = Router();

router.post("/:vehicleId/fuel-logs", authenticatePin, addFuelLog);
router.get("/:vehicleId/fuel-logs", authenticatePin, getFuelLogs);
router.get("/fuel-logs/:id", authenticatePin, getFuelLogById);
router.put("/fuel-logs/:id", authenticatePin, updateFuelLog);
router.delete("/fuel-logs/:id", authenticatePin, deleteFuelLog);

export default router;
