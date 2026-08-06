import express from "express";
import {
  getPopulationTrends,
  getDivisionPopulation,
  getInstitutionDistribution,
  getAnalyticsMetrics,
  getAllAnalytics
} from "../controllers/analyticsController.js";

const router = express.Router();

// Get all analytics data in one call
router.get("/all", getAllAnalytics);

// Get individual analytics components
router.get("/population-trends", getPopulationTrends);
router.get("/division-population", getDivisionPopulation);
router.get("/institution-distribution", getInstitutionDistribution);
router.get("/metrics", getAnalyticsMetrics);

export default router;