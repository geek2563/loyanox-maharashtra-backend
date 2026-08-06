import express from "express";
import {
  getActivityLogs,
  getActivityLog,
  createActivityLog,
  updateActivityLog,
  deleteActivityLog,
} from "../controllers/activityLogController.js";

const router = express.Router();

router.route("/").get(getActivityLogs).post(createActivityLog);

router
  .route("/:id")
  .get(getActivityLog)
  .patch(updateActivityLog)
  .delete(deleteActivityLog);

export default router;
