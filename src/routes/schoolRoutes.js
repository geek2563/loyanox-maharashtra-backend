import express from "express";
import {
  getSchools,
  getSchool,
  createSchool,
  updateSchool,
  deleteSchool,
} from "../controllers/schoolController.js";

import { protect } from "../middleware/authMiddleware.js";
import { checkGeographicPermission } from "../middleware/checkPermissions.js";

const router = express.Router();

router
  .route("/")
  .get(getSchools)
  .post(protect, checkGeographicPermission("canCreate"), createSchool);
router
  .route("/:slug")
  .get(getSchool)
  .patch(protect, checkGeographicPermission("canEdit"), updateSchool)
  .put(protect, checkGeographicPermission("canEdit"), updateSchool)
  .delete(protect, checkGeographicPermission("canDelete"), deleteSchool);

export default router;
