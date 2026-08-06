import express from "express";
import {
  createWorkAssignment,
  getWorkAssignments,
  getWorkAssignment,
  updateWorkAssignment,
  deleteWorkAssignment,
  getUserAssignments,
} from "../controllers/workAssignmentController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get assignments for current user (authenticated users can see their own assignments)
router.get("/my-assignments", getUserAssignments);

// Get assignments for a specific user (must be before /:id route) - restricted to superadmin only
router.get("/user/:userId", authorize("superadmin"), getUserAssignments);

// CRUD operations - restricted to superadmin only
router
  .route("/")
  .get(authorize("superadmin"), getWorkAssignments)
  .post(authorize("superadmin"), createWorkAssignment);
router
  .route("/:id")
  .get(authorize("superadmin"), getWorkAssignment)
  .put(authorize("superadmin"), updateWorkAssignment)
  .delete(authorize("superadmin"), deleteWorkAssignment);

export default router;
