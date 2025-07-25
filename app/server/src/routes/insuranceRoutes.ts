import { Router } from "express";
import {
  addInsurance,
  getInsurance,
  updateInsurance,
  deleteInsurance,
} from "../controllers/InsuranceController.js";
import { authenticatePin } from "../middleware/auth.js";

const router = Router({ mergeParams: true });

router.post("/", authenticatePin, addInsurance);
router.get("/", authenticatePin, getInsurance);
router.put("/", authenticatePin, updateInsurance);
router.delete("/", authenticatePin, deleteInsurance);

export default router;
