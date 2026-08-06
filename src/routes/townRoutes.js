import express from "express";
import {
  getTowns,
  getTown,
  createTown,
  updateTown,
  deleteTown,
} from "../controllers/townController.js";

import { protect } from "../middleware/authMiddleware.js";
import { checkGeographicPermission } from "../middleware/checkPermissions.js";

const router = express.Router();

router
  .route("/")
  .get(getTowns)
  .post(protect, checkGeographicPermission("canCreate"), createTown);
router
  .route("/:slug")
  .get(getTown)
  .put(protect, checkGeographicPermission("canEdit"), updateTown)
  .delete(protect, checkGeographicPermission("canDelete"), deleteTown);

export default router;
