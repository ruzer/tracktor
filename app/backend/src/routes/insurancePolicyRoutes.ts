import { Router } from "express";
import { authenticatePin } from "@middleware/auth.js";
import { 
  requireInsuranceAdmin, 
  requireInsuranceViewer 
} from "@middleware/insurance-auth.js";
import { asyncHandler } from "@middleware/async-handler.js";
import {
  assignVehiclesController,
  createPolicyController,
  deletePolicyController,
  getPolicyController,
  insuranceReportController,
  listPoliciesController,
  listPolicyVehiclesController,
  removeVehicleController,
  renewPoliciesBulkController,
  renewPolicyController,
  updatePolicyController,
} from "@controllers/InsurancePolicyController.js";

const router = Router();

// Viewer operations (read-only)
router.get("/", authenticatePin, requireInsuranceViewer, asyncHandler(listPoliciesController));
router.get("/report", authenticatePin, requireInsuranceViewer, asyncHandler(insuranceReportController));
router.get("/:id", authenticatePin, requireInsuranceViewer, asyncHandler(getPolicyController));
router.get(
  "/:id/vehicles",
  authenticatePin,
  requireInsuranceViewer,
  asyncHandler(listPolicyVehiclesController),
);

// Admin operations (create, update, delete)
router.post("/", authenticatePin, requireInsuranceAdmin, asyncHandler(createPolicyController));
router.post("/renew", authenticatePin, requireInsuranceAdmin, asyncHandler(renewPoliciesBulkController));
router.put("/:id", authenticatePin, requireInsuranceAdmin, asyncHandler(updatePolicyController));
router.delete("/:id", authenticatePin, requireInsuranceAdmin, asyncHandler(deletePolicyController));
router.post("/:id/renew", authenticatePin, requireInsuranceAdmin, asyncHandler(renewPolicyController));
router.post(
  "/:id/vehicles",
  authenticatePin,
  requireInsuranceAdmin,
  asyncHandler(assignVehiclesController),
);
router.delete(
  "/:id/vehicles/:vehicleId",
  authenticatePin,
  requireInsuranceAdmin,
  asyncHandler(removeVehicleController),
);

export default router;
