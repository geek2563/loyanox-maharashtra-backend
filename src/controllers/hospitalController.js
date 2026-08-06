import Hospital from "../models/HospitalModel.js";
import {
  getAll,
  getOne,
  createOne,
  updateBySlug,
  deleteBySlug,
  getBySlug,
} from "./factoryController.js";

export const getHospitals = getAll(Hospital);
export const getHospital = getBySlug(Hospital);
export const createHospital = createOne(Hospital);
export const updateHospital = updateBySlug(Hospital);
export const deleteHospital = deleteBySlug(Hospital);
