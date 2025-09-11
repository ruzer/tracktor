import { Router } from "express";
import { authenticatePin } from "@middleware/auth.js";
import { asyncHandler } from "@middleware/async-handler.js";
import { addPlate, listPlates, markCurrent, retirePlate } from "@controllers/VehiclePlateController.js";

const router = Router({ mergeParams: true });

router.get("/", authenticatePin, asyncHandler(listPlates));
router.post("/", authenticatePin, asyncHandler(addPlate));
router.patch("/:plateId/current", authenticatePin, asyncHandler(markCurrent));
router.patch("/:plateId/retire", authenticatePin, asyncHandler(retirePlate));

export default router;

