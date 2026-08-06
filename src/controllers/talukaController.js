import Taluka from "../models/TalukaModel.js";
import Village from "../models/VillageModel.js";
import City from "../models/CityModel.js";
import Town from "../models/TownModel.js";

import {
  getAll,
  createOne,
  updateBySlug,
  getBySlug,
} from "./factoryController.js";

export const getTalukas = getAll(Taluka);

export const getTaluka = getBySlug(Taluka);

export const createTaluka = createOne(Taluka);

export const updateTaluka = updateBySlug(Taluka);

export const deleteTaluka = async (req, res) => {
  try {
    const talukaSlug = req.params.slug;

    const taluka = await Taluka.findOne({ slug: talukaSlug });
    if (!taluka) {
      return res.status(404).json({
        success: false,
        message: "Taluka not found",
      });
    }

    // Delete all villages, cities, towns in this taluka
    await Village.deleteMany({ taluka: talukaSlug });
    await City.deleteMany({ taluka: talukaSlug });
    await Town.deleteMany({ taluka: talukaSlug });

    // Delete taluka
    await Taluka.findOneAndDelete({ slug: talukaSlug });

    res.status(200).json({
      success: true,
      message: "Taluka and all related data deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/*
GET
/api/v1/talukas/haveli/villages
*/
export const getTalukaVillages = async (req, res) => {
  try {
    const taluka = await Taluka.findOne({
      slug: req.params.slug,
    });

    if (!taluka) {
      return res.status(404).json({
        success: false,
        message: "Taluka not found",
      });
    }

    const villages = await Village.find({
      taluka: taluka.name,
    });

    res.status(200).json({
      success: true,
      count: villages.length,
      data: villages,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/*
GET
/api/v1/talukas/haveli/cities
*/
export const getTalukaCities = async (req, res) => {
  try {
    const taluka = await Taluka.findOne({
      slug: req.params.slug,
    });

    if (!taluka) {
      return res.status(404).json({
        success: false,
        message: "Taluka not found",
      });
    }

    const cities = await City.find({
      taluka: taluka.name,
    });

    res.status(200).json({
      success: true,
      count: cities.length,
      data: cities,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/*
GET
/api/v1/talukas/haveli/towns
*/
export const getTalukaTowns = async (req, res) => {
  try {
    const taluka = await Taluka.findOne({
      slug: req.params.slug,
    });

    if (!taluka) {
      return res.status(404).json({
        success: false,
        message: "Taluka not found",
      });
    }

    const towns = await Town.find({
      taluka: taluka.name,
    });

    res.status(200).json({
      success: true,
      count: towns.length,
      data: towns,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
