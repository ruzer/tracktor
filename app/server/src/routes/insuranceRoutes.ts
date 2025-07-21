import { Router } from "express";
import {
  addInsurance,
  getInsurance,
  updateInsurance,
  deleteInsurance,
} from "../controllers/insuranceController.js";
import { authenticatePin } from "../middleware/auth.js";

const router = Router();

router.post("/:vehicleId/insurance", authenticatePin, addInsurance);
router.get("/:vehicleId/insurance", authenticatePin, getInsurance);
router.put("/:vehicleId/insurance", authenticatePin, updateInsurance);
router.delete("/:vehicleId/insurance", authenticatePin, deleteInsurance);

export default router;
