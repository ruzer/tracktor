import { Router } from "express";
import {
  addVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
} from "../controllers/vehicleController.js";
import { authenticatePin } from "../middleware/auth.js";

const router = Router();

router.post("/", authenticatePin, addVehicle);
router.get("/", authenticatePin, getAllVehicles);
router.get("/:id", authenticatePin, getVehicleById);
router.put("/:id", authenticatePin, updateVehicle);
router.delete("/:id", authenticatePin, deleteVehicle);

export default router;
