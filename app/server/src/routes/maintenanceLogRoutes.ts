import { Router } from "express";
import {
  addMaintenanceLog,
  getMaintenanceLogs,
  getMaintenanceLogById,
  updateMaintenanceLog,
  deleteMaintenanceLog,
} from "../controllers/MaintenanceLogController.js";
import { authenticatePin } from "../middleware/auth.js";

const router = Router();

router.post(
  "/:vehicleId/maintenance-logs",
  authenticatePin,
  addMaintenanceLog
);
router.get(
  "/:vehicleId/maintenance-logs",
  authenticatePin,
  getMaintenanceLogs
);
router.get(
  "/maintenance-logs/:id",
  authenticatePin,
  getMaintenanceLogById
);
router.put(
  "/maintenance-logs/:id",
  authenticatePin,
  updateMaintenanceLog
);
router.delete(
  "/maintenance-logs/:id",
  authenticatePin,
  deleteMaintenanceLog
);

export default router;
