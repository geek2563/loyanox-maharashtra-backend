import express from "express";

import {
  getTalukas,
  getTaluka,
  createTaluka,
  updateTaluka,
  deleteTaluka,
  getTalukaVillages,
  getTalukaCities,
  getTalukaTowns,
} from "../controllers/talukaController.js";

import { protect } from "../middleware/authMiddleware.js";
import { checkGeographicPermission } from "../middleware/checkPermissions.js";

const router = express.Router();

router
  .route("/")
  .get(getTalukas)
  .post(protect, checkGeographicPermission("canCreate"), createTaluka);

router.get("/:slug/villages", getTalukaVillages);

router.get("/:slug/cities", getTalukaCities);

router.get("/:slug/towns", getTalukaTowns);

router
  .route("/:slug")
  .get(getTaluka)
  .put(protect, checkGeographicPermission("canEdit"), updateTaluka)
  .delete(protect, checkGeographicPermission("canDelete"), deleteTaluka);

export default router;
