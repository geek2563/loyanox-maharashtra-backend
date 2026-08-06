import School from "../models/SchoolModel.js";
import {
  getAll,
  getOne,
  createOne,
  updateBySlug,
  deleteBySlug,
  getBySlug,
} from "./factoryController.js";

export const getSchools = getAll(School);
export const getSchool = getBySlug(School);
export const createSchool = createOne(School);
export const updateSchool = updateBySlug(School);
export const deleteSchool = deleteBySlug(School);
