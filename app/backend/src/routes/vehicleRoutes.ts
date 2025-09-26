import { Router } from "express";
import type { RequestHandler } from "express";
import {
  addVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
  importVehicles,
} from "@controllers/VehicleController.js";
import multer from "multer";
import { authenticatePin } from "@middleware/auth.js";
import { asyncHandler } from "@middleware/async-handler.js";
import fuelLogRoutes from "./fuelLogRoutes.js";
import fuelLogLPRoutes from "./fuelLogLPRoutes.js";
import insuranceRoutes from "./insuranceRoutes.js";
import maintenanceLogRoutes from "./maintenanceLogRoutes.js";
import maintenanceOrderRoutes from "./maintenanceOrderRoutes.js";
import puccRoutes from "./puccRoutes.js";
import vehiclePlateRoutes from "./vehiclePlateRoutes.js";
import vehicleAssignmentRoutes from "./vehicleAssignmentRoutes.js";
import vehicleTaxRoutes from "./vehicleTaxRoutes.js";

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});
const uploadSingle: RequestHandler = (req, res, next) => {
  const single = upload.single("file") as unknown as RequestHandler;
  single(req, res, next);
};


router.post("/", authenticatePin, asyncHandler(addVehicle));
router.get("/", authenticatePin, asyncHandler(getAllVehicles));
router.get("/:id", authenticatePin, asyncHandler(getVehicleById));
router.put("/:id", authenticatePin, asyncHandler(updateVehicle));
router.delete("/:id", authenticatePin, asyncHandler(deleteVehicle));
router.post(
  "/import",
  authenticatePin,
  uploadSingle,
  asyncHandler(importVehicles),
);

router.use("/:vehicleId/fuel-logs", fuelLogRoutes);
router.use("/lp/:licensePlate/fuel-logs", fuelLogLPRoutes);
router.use("/:vehicleId/insurance", insuranceRoutes);
router.use("/:vehicleId/maintenance-logs", maintenanceLogRoutes);
router.use("/:vehicleId/maintenance-orders", maintenanceOrderRoutes);
router.use("/:vehicleId/pucc", puccRoutes);
router.use("/:vehicleId/plates", vehiclePlateRoutes);
router.use("/:vehicleId/assignments", vehicleAssignmentRoutes);
router.use("/:vehicleId/taxes", vehicleTaxRoutes);

export default router;
