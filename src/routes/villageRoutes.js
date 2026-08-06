import express from "express";
import {
  getVillages,
  getVillage,
  createVillage,
  updateVillage,
  deleteVillage,
} from "../controllers/villageController.js";

import { protect } from "../middleware/authMiddleware.js";
import { checkGeographicPermission } from "../middleware/checkPermissions.js";

const router = express.Router();

router
  .route("/")
  .get(getVillages)
  .post(protect, checkGeographicPermission("canCreate"), createVillage);
router
  .route("/:slug")
  .get(getVillage)
  .put(protect, checkGeographicPermission("canEdit"), updateVillage)
  .delete(protect, checkGeographicPermission("canDelete"), deleteVillage);

export default router;
