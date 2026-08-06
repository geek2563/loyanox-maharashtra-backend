import Village from "../models/VillageModel.js";
import School from "../models/SchoolModel.js";
import College from "../models/CollegeModel.js";
import Hospital from "../models/HospitalModel.js";
import WorkAssignment from "../models/WorkAssignmentModel.js";

import {
  getAll,
  getBySlug,
  createOne,
  updateBySlug,
  deleteBySlug,
} from "./factoryController.js";
import mongoose from "mongoose";

export const getVillages = getAll(Village);

export const getVillage = getBySlug(Village);

export const createVillage = createOne(Village);

export const updateVillage = updateBySlug(Village);

const escapeRegex = (str) => (str ? str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") : "");

export const deleteVillage = async (req, res) => {
  try {
    const slugOrId = req.params.slug;
    const isObjectId = mongoose.Types.ObjectId.isValid(slugOrId);
    const query = isObjectId
      ? { $or: [{ slug: slugOrId }, { _id: slugOrId }] }
      : { slug: slugOrId };

    const village = await Village.findOne(query);

    if (!village) {
      return res.status(404).json({
        success: false,
        message: "Not Found",
      });
    }

    const matchCriteria = [];
    if (village.name) {
      matchCriteria.push({ village: village.name });
      matchCriteria.push({ village: new RegExp(`^${escapeRegex(village.name)}$`, "i") });
    }
    if (village.slug) {
      matchCriteria.push({ village: village.slug });
      matchCriteria.push({ village: new RegExp(`^${escapeRegex(village.slug)}$`, "i") });
    }
    if (village._id) {
      matchCriteria.push({ village: village._id.toString() });
      matchCriteria.push({ village: village._id });
    }

    const filter = matchCriteria.length > 0 ? { $or: matchCriteria } : { village: village.name };

    // Delete associated schools, colleges, and hospitals
    await School.deleteMany(filter);
    await College.deleteMany(filter);
    await Hospital.deleteMany(filter);

    // Delete associated work assignments if any
    const assignmentCriteria = [];
    if (village.slug) assignmentCriteria.push({ settlementSlug: village.slug });
    if (village.name) assignmentCriteria.push({ settlementSlug: village.name });
    if (village._id) assignmentCriteria.push({ settlementSlug: village._id.toString() });
    if (assignmentCriteria.length > 0) {
      await WorkAssignment.deleteMany({ $or: assignmentCriteria });
    }

    // Delete the village
    await Village.findOneAndDelete(query);

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
