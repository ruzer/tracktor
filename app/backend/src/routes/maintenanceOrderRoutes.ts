import { Router } from "express";
import { authenticatePin } from "@middleware/auth.js";
import { asyncHandler } from "@middleware/async-handler.js";
import {
  appendHistory,
  createOrder,
  getOrder,
  listOrders,
  patchOrder,
  removeOrder,
} from "@controllers/MaintenanceOrderController.js";

const router = Router({ mergeParams: true });

router.post("/", authenticatePin, asyncHandler(createOrder));
router.get("/", authenticatePin, asyncHandler(listOrders));
router.get("/:orderId", authenticatePin, asyncHandler(getOrder));
router.patch("/:orderId", authenticatePin, asyncHandler(patchOrder));
router.post("/:orderId/history", authenticatePin, asyncHandler(appendHistory));
router.delete("/:orderId", authenticatePin, asyncHandler(removeOrder));

export default router;
