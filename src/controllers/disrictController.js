import District from "../models/DistrictModel.js";
import Taluka from "../models/TalukaModel.js";
import Village from "../models/VillageModel.js";
import City from "../models/CityModel.js";
import Town from "../models/TownModel.js";

import {
  getAll,
  createOne,
  updateBySlug,
  deleteBySlug,
  getBySlug,
} from "./factoryController.js";

export const getDistricts = getAll(District);

export const getDistrict = getBySlug(District);

export const createDistrict = createOne(District);

export const updateDistrict = updateBySlug(District);

export const deleteDistrict = async (req, res) => {
  try {
    const districtSlug = req.params.slug;

    const district = await District.findOne({ slug: districtSlug });
    if (!district) {
      return res.status(404).json({
        success: false,
        message: "District not found",
      });
    }

    // Delete all talukas in this district
    const talukas = await Taluka.find({ district: districtSlug });
    for (const taluka of talukas) {
      // Delete all villages, cities, towns in this taluka
      await Village.deleteMany({ taluka: taluka.slug });
      await City.deleteMany({ taluka: taluka.slug });
      await Town.deleteMany({ taluka: taluka.slug });
    }

    // Delete talukas
    await Taluka.deleteMany({ district: districtSlug });

    // Delete villages, cities, towns directly under district
    await Village.deleteMany({ district: districtSlug });
    await City.deleteMany({ district: districtSlug });
    await Town.deleteMany({ district: districtSlug });

    // Delete district
    await District.findOneAndDelete({ slug: districtSlug });

    res.status(200).json({
      success: true,
      message: "District and all related data deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/*
GET
/api/v1/districts/pune/talukas
*/
export const getDistrictTalukas = async (req, res) => {
  try {
    const district = await District.findOne({
      slug: req.params.slug,
    });

    if (!district) {
      return res.status(404).json({
        success: false,
        message: "District not found",
      });
    }

    const talukas = await Taluka.find({
      district: district.slug,
    });

    res.status(200).json({
      success: true,
      count: talukas.length,
      data: talukas,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
