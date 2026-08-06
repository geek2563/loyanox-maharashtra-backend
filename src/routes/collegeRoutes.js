import express from "express";
import {
  getColleges,
  getCollege,
  createCollege,
  updateCollege,
  deleteCollege,
} from "../controllers/collegeController.js";

import { protect } from "../middleware/authMiddleware.js";
import { checkGeographicPermission } from "../middleware/checkPermissions.js";

const router = express.Router();

router
  .route("/")
  .get(getColleges)
  .post(protect, checkGeographicPermission("canCreate"), createCollege);
router
  .route("/:slug")
  .get(getCollege)
  .patch(protect, checkGeographicPermission("canEdit"), updateCollege)
  .put(protect, checkGeographicPermission("canEdit"), updateCollege)
  .delete(protect, checkGeographicPermission("canDelete"), deleteCollege);

export default router;
