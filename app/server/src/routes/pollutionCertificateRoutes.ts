import { Router } from "express";
import {
  addPollutionCertificate,
  getPollutionCertificate,
  updatePollutionCertificate,
  deletePollutionCertificate,
} from "../controllers/PUCCController.js";
import { authenticatePin } from "../middleware/auth.js";

const router = Router();

router.post(
  "/:vehicleId/pollution-certificate",
  authenticatePin,
  addPollutionCertificate
);
router.get(
  "/:vehicleId/pollution-certificate",
  authenticatePin,
  getPollutionCertificate
);
router.put(
  "/:vehicleId/pollution-certificate",
  authenticatePin,
  updatePollutionCertificate
);
router.delete(
  "/:vehicleId/pollution-certificate",
  authenticatePin,
  deletePollutionCertificate
);

export default router;
