import City from "../models/CityModel.js";
import School from "../models/SchoolModel.js";
import College from "../models/CollegeModel.js";
import Hospital from "../models/HospitalModel.js";
import WorkAssignment from "../models/WorkAssignmentModel.js";
import {
  getAll,
  getOne,
  createOne,
  updateBySlug,
  deleteBySlug,
  getBySlug,
} from "./factoryController.js";
import mongoose from "mongoose";

export const getCities = getAll(City);
export const getCity = getBySlug(City);
export const createCity = createOne(City);
export const updateCity = updateBySlug(City);

const escapeRegex = (str) => (str ? str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") : "");

export const deleteCity = async (req, res) => {
  try {
    const slugOrId = req.params.slug;
    const isObjectId = mongoose.Types.ObjectId.isValid(slugOrId);
    const query = isObjectId
      ? { $or: [{ slug: slugOrId }, { _id: slugOrId }] }
      : { slug: slugOrId };

    const city = await City.findOne(query);

    if (!city) {
      return res.status(404).json({
        success: false,
        message: "Not Found",
      });
    }

    const matchCriteria = [];
    if (city.name) {
      matchCriteria.push({ city: city.name });
      matchCriteria.push({ city: new RegExp(`^${escapeRegex(city.name)}$`, "i") });
    }
    if (city.slug) {
      matchCriteria.push({ city: city.slug });
      matchCriteria.push({ city: new RegExp(`^${escapeRegex(city.slug)}$`, "i") });
    }
    if (city._id) {
      matchCriteria.push({ city: city._id.toString() });
      matchCriteria.push({ city: city._id });
    }

    const filter = matchCriteria.length > 0 ? { $or: matchCriteria } : { city: city.name };

    // Delete associated schools, colleges, and hospitals
    await School.deleteMany(filter);
    await College.deleteMany(filter);
    await Hospital.deleteMany(filter);

    // Delete associated work assignments if any
    const assignmentCriteria = [];
    if (city.slug) assignmentCriteria.push({ settlementSlug: city.slug });
    if (city.name) assignmentCriteria.push({ settlementSlug: city.name });
    if (city._id) assignmentCriteria.push({ settlementSlug: city._id.toString() });
    if (assignmentCriteria.length > 0) {
      await WorkAssignment.deleteMany({ $or: assignmentCriteria });
    }

    // Delete the city
    await City.findOneAndDelete(query);

    res.status(200).json({
      success: true,
      message: "Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
