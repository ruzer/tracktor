import { Router } from "express";
import { authenticatePin } from "@middleware/auth.js";
import { asyncHandler } from "@middleware/async-handler.js";
import { listTaxes, markPaid, upsertTax } from "@controllers/VehicleTaxController.js";

const router = Router({ mergeParams: true });

router.get('/', authenticatePin, asyncHandler(listTaxes));
router.post('/', authenticatePin, asyncHandler(upsertTax));
router.patch('/:id/paid', authenticatePin, asyncHandler(markPaid));

export default router;
