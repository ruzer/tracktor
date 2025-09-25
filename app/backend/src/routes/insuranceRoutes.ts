import { Router } from "express";
import {
  addInsurance,
  getInsurances,
  updateInsurance,
  deleteInsurance,
} from "@controllers/InsuranceController.js";
import { authenticatePin } from "@middleware/auth.js";
import { 
  requireInsuranceAdmin, 
  requireInsuranceViewer 
} from "@middleware/insurance-auth.js";
import { asyncHandler } from "@middleware/async-handler.js";

const router = Router({ mergeParams: true });

// Admin operations (create, update, delete)
router.post("/", authenticatePin, requireInsuranceAdmin, asyncHandler(addInsurance));
router.put("/:id", authenticatePin, requireInsuranceAdmin, asyncHandler(updateInsurance));
router.delete("/:id", authenticatePin, requireInsuranceAdmin, asyncHandler(deleteInsurance));

// Viewer operations (read)
router.get("/", authenticatePin, requireInsuranceViewer, asyncHandler(getInsurances));

export default router;
