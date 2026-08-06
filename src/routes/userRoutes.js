import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { superAdminOnly } from "../middleware/superAdminMiddleware.js";
import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getMe,
} from "../controllers/userController.js";

const router = express.Router();

// Base routes
router
  .route("/")
  .get(protect, getUsers)
  .post(protect, superAdminOnly, createUser);

// 1. CRITICAL: Static route must be placed BEFORE the dynamic /:id parameter!
router.route("/me").get(protect, getMe);

// Dynamic routes
router
  .route("/:id")
  .get(protect, getUser)
  .patch(protect, updateUser)
  .delete(protect, deleteUser);

export default router;
