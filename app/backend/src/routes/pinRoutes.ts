import { Router } from "express";
import { setPin, verifyPin, getPinStatus } from "@controllers/PinController.js";
import { asyncHandler } from "@middleware/async-handler.js";

const router = Router();

router.post("/pin", asyncHandler(setPin));
router.post("/pin/verify", asyncHandler(verifyPin));
router.get("/pin/status", asyncHandler(getPinStatus));

export default router;
