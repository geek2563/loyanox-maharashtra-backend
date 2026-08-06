import ActivityLog from "../models/ActivityLogModel.js";
import {
  getAll,
  getOne,
  createOne,
  updateBySlug,
  deleteBySlug,
} from "./factoryController.js";

export const getActivityLogs = getAll(ActivityLog);
export const getActivityLog = getOne(ActivityLog);
export const createActivityLog = createOne(ActivityLog);
export const updateActivityLog = updateBySlug(ActivityLog);
export const deleteActivityLog = deleteBySlug(ActivityLog);
