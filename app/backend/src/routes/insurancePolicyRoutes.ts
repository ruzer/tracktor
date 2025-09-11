import { Router } from "express";
import { authenticatePin } from "@middleware/auth.js";
import { asyncHandler } from "@middleware/async-handler.js";
import { assignVehicles, createPolicy, getPolicy, listPolicies, listPolicyVehicles, removeVehicle } from "@controllers/InsurancePolicyController.js";

const router = Router();

router.post('/', authenticatePin, asyncHandler(createPolicy));
router.get('/', authenticatePin, asyncHandler(listPolicies));
router.get('/:id', authenticatePin, asyncHandler(getPolicy));
router.get('/:id/vehicles', authenticatePin, asyncHandler(listPolicyVehicles));
router.post('/:id/vehicles', authenticatePin, asyncHandler(assignVehicles));
router.delete('/:id/vehicles/:vehicleId', authenticatePin, asyncHandler(removeVehicle));

export default router;
