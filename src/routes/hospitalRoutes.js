import express from "express";
import {
  getHospitals,
  getHospital,
  createHospital,
  updateHospital,
  deleteHospital,
} from "../controllers/hospitalController.js";

import { protect } from "../middleware/authMiddleware.js";
import { checkGeographicPermission } from "../middleware/checkPermissions.js";

const router = express.Router();

router
  .route("/")
  .get(getHospitals)
  .post(protect, checkGeographicPermission("canCreate"), createHospital);
router
  .route("/:slug")
  .get(getHospital)
  .patch(protect, checkGeographicPermission("canEdit"), updateHospital)
  .put(protect, checkGeographicPermission("canEdit"), updateHospital)
  .delete(protect, checkGeographicPermission("canDelete"), deleteHospital);

export default router;
