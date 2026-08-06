import express from "express";

import {
  getDivisions,
  getDivision,
  createDivision,
  updateDivision,
  deleteDivision,
  getDivisionDistricts,
  getDivisionPopulation,
  getSettlementHierarchy,
} from "../controllers/divisionController.js";
import { protect } from "../middleware/authMiddleware.js";
import { checkGeographicPermission } from "../middleware/checkPermissions.js";

const router = express.Router();

router
  .route("/")
  .get(getDivisions)
  .post(protect, checkGeographicPermission("canCreate"), createDivision);

router.get("/population/stats", getDivisionPopulation);
router.get("/hierarchy/:type/:slug", getSettlementHierarchy);
router.get("/:slug/districts", getDivisionDistricts);

router
  .route("/:slug")
  .get(getDivision)
  .put(protect, checkGeographicPermission("canEdit"), updateDivision)
  .delete(protect, checkGeographicPermission("canDelete"), deleteDivision);

export default router;

