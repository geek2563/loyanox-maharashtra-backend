import express from "express";

import {
  getPopulations,
  getPopulation,
  createPopulation,
  updatePopulation,
  deletePopulation,
} from "../controllers/populationController.js";

const router = express.Router();

router.route("/").get(getPopulations).post(createPopulation);

router
  .route("/:year")
  .get(getPopulation)
  .put(updatePopulation)
  .delete(deletePopulation);

export default router;
