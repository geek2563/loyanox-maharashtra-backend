import express from "express";

import {
  getDistricts,
  getDistrict,
  createDistrict,
  updateDistrict,
  deleteDistrict,
  getDistrictTalukas,
} from "../controllers/disrictController.js";

import { protect } from "../middleware/authMiddleware.js";
import { checkGeographicPermission } from "../middleware/checkPermissions.js";

const router = express.Router();

router
  .route("/")
  .get(getDistricts)
  .post(protect, checkGeographicPermission("canCreate"), createDistrict);

router.get("/:slug/talukas", getDistrictTalukas);

router
  .route("/:slug")
  .get(getDistrict)
  .put(protect, checkGeographicPermission("canEdit"), updateDistrict)
  .delete(protect, checkGeographicPermission("canDelete"), deleteDistrict);

export default router;
