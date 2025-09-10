import { Router } from "express";
import { authenticatePin } from "@middleware/auth.js";
import { asyncHandler } from "@middleware/async-handler.js";
import { addAssignment, closeAssignment, listAssignments } from "@controllers/VehicleAssignmentController.js";

const router = Router({ mergeParams: true });

router.get('/', authenticatePin, asyncHandler(listAssignments));
router.post('/', authenticatePin, asyncHandler(addAssignment));
router.patch('/:assignmentId/close', authenticatePin, asyncHandler(closeAssignment));

export default router;
