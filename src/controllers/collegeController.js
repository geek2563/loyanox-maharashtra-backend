import College from "../models/CollegeModel.js";
import {
  getAll,
  getOne,
  createOne,
  updateBySlug,
  deleteBySlug,
  getBySlug,
} from "./factoryController.js";

export const getColleges = getAll(College);
export const getCollege = getBySlug(College);
export const createCollege = createOne(College);
export const updateCollege = updateBySlug(College);
export const deleteCollege = deleteBySlug(College);
