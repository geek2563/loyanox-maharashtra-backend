import express from "express";
import {
  getCities,
  getCity,
  createCity,
  updateCity,
  deleteCity,
} from "../controllers/cityController.js";

import { protect } from "../middleware/authMiddleware.js";
import { checkGeographicPermission } from "../middleware/checkPermissions.js";

const router = express.Router();

router
  .route("/")
  .get(getCities)
  .post(protect, checkGeographicPermission("canCreate"), createCity);
router
  .route("/:slug")
  .get(getCity)
  .put(protect, checkGeographicPermission("canEdit"), updateCity)
  .delete(protect, checkGeographicPermission("canDelete"), deleteCity);

export default router;
