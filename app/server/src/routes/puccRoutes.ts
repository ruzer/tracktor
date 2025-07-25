import { Router } from "express";
import {
  addPollutionCertificate,
  getPollutionCertificate,
  updatePollutionCertificate,
  deletePollutionCertificate,
} from "../controllers/PUCCController.js";
import { authenticatePin } from "../middleware/auth.js";

const router = Router({ mergeParams: true });

router.post("/", authenticatePin, addPollutionCertificate);
router.get("/", authenticatePin, getPollutionCertificate);
router.put("/", authenticatePin, updatePollutionCertificate);
router.delete("/", authenticatePin, deletePollutionCertificate);

export default router;
