import Town from "../models/TownModel.js";
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

export const getTowns = getAll(Town);
export const getTown = getBySlug(Town);
export const createTown = createOne(Town);
export const updateTown = updateBySlug(Town);

const escapeRegex = (str) => (str ? str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") : "");

export const deleteTown = async (req, res) => {
  try {
    const slugOrId = req.params.slug;
    const isObjectId = mongoose.Types.ObjectId.isValid(slugOrId);
    const query = isObjectId
      ? { $or: [{ slug: slugOrId }, { _id: slugOrId }] }
      : { slug: slugOrId };

    const town = await Town.findOne(query);

    if (!town) {
      return res.status(404).json({
        success: false,
        message: "Not Found",
      });
    }

    const matchCriteria = [];
    if (town.name) {
      matchCriteria.push({ town: town.name });
      matchCriteria.push({ town: new RegExp(`^${escapeRegex(town.name)}$`, "i") });
    }
    if (town.slug) {
      matchCriteria.push({ town: town.slug });
      matchCriteria.push({ town: new RegExp(`^${escapeRegex(town.slug)}$`, "i") });
    }
    if (town._id) {
      matchCriteria.push({ town: town._id.toString() });
      matchCriteria.push({ town: town._id });
    }

    const filter = matchCriteria.length > 0 ? { $or: matchCriteria } : { town: town.name };

    // Delete associated schools, colleges, and hospitals
    await School.deleteMany(filter);
    await College.deleteMany(filter);
    await Hospital.deleteMany(filter);

    // Delete associated work assignments if any
    const assignmentCriteria = [];
    if (town.slug) assignmentCriteria.push({ settlementSlug: town.slug });
    if (town.name) assignmentCriteria.push({ settlementSlug: town.name });
    if (town._id) assignmentCriteria.push({ settlementSlug: town._id.toString() });
    if (assignmentCriteria.length > 0) {
      await WorkAssignment.deleteMany({ $or: assignmentCriteria });
    }

    // Delete the town
    await Town.findOneAndDelete(query);

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
