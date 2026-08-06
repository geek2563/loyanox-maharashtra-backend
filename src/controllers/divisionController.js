import Division from "../models/DivisionModel.js";

import {
  getAll,
  getBySlug,
  createOne,
  updateBySlug,
} from "./factoryController.js";
import District from "../models/DistrictModel.js";
import Taluka from "../models/TalukaModel.js";
import Village from "../models/VillageModel.js";
import City from "../models/CityModel.js";
import Town from "../models/TownModel.js";

export const getDivisions = getAll(Division);

export const getDivision = getBySlug(Division);

export const createDivision = createOne(Division);

export const updateDivision = updateBySlug(Division);

export const deleteDivision = async (req, res) => {
  try {
    const divisionSlug = req.params.slug;

    const division = await Division.findOne({ slug: divisionSlug });
    if (!division) {
      return res.status(404).json({
        success: false,
        message: "Division not found",
      });
    }

    // Delete all districts in this division
    const districts = await District.find({ division: divisionSlug });
    for (const district of districts) {
      // Delete all talukas in this district
      const talukas = await Taluka.find({ district: district.slug });
      for (const taluka of talukas) {
        // Delete all villages, cities, towns in this taluka
        await Village.deleteMany({ taluka: taluka.slug });
        await City.deleteMany({ taluka: taluka.slug });
        await Town.deleteMany({ taluka: taluka.slug });
      }
      // Delete talukas
      await Taluka.deleteMany({ district: district.slug });
      // Delete villages, cities, towns directly under district
      await Village.deleteMany({ district: district.slug });
      await City.deleteMany({ district: district.slug });
      await Town.deleteMany({ district: district.slug });
    }

    // Delete districts
    await District.deleteMany({ division: divisionSlug });

    // Delete talukas, villages, cities, towns directly under division
    await Taluka.deleteMany({ division: divisionSlug });
    await Village.deleteMany({ division: divisionSlug });
    await City.deleteMany({ division: divisionSlug });
    await Town.deleteMany({ division: divisionSlug });

    // Delete division
    await Division.findOneAndDelete({ slug: divisionSlug });

    res.status(200).json({
      success: true,
      message: "Division and all related data deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getDivisionDistricts = async (req, res) => {
  try {
    console.log("Division slug:", req.params.slug);

    const districts = await District.find({
      division: req.params.slug,
    });

    console.log("Districts found:", districts.length);

    res.status(200).json({
      success: true,
      count: districts.length,
      data: districts,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getDivisionPopulation = async (req, res) => {
  try {
    const divisions = await Division.find({}, { name: 1, slug: 1 });

    const divisionPopulationData = await Promise.all(
      divisions.map(async (division) => {
        // Aggregate population from all villages, cities, and towns in this division
        const [villagePop, cityPop, townPop] = await Promise.all([
          Village.aggregate([
            { $match: { division: division.slug } },
            {
              $group: {
                _id: null,
                total: { $sum: { $ifNull: ["$population", 0] } },
              },
            },
          ]),
          City.aggregate([
            { $match: { division: division.slug } },
            {
              $group: {
                _id: null,
                total: { $sum: { $ifNull: ["$population", 0] } },
              },
            },
          ]),
          Town.aggregate([
            { $match: { division: division.slug } },
            {
              $group: {
                _id: null,
                total: { $sum: { $ifNull: ["$population", 0] } },
              },
            },
          ]),
        ]);

        const totalPopulation =
          (villagePop[0]?.total || 0) +
          (cityPop[0]?.total || 0) +
          (townPop[0]?.total || 0);

        return {
          name: division.name,
          slug: division.slug,
          population: totalPopulation,
        };
      }),
    );

    // Sort by population descending and take top 6
    const sortedData = divisionPopulationData
      .sort((a, b) => b.population - a.population)
      .slice(0, 6);

    res.status(200).json({
      success: true,
      data: sortedData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getSettlementHierarchy = async (req, res) => {
  try {
    const { slug, type } = req.params;

    let Model;
    if (type === "villages") Model = Village;
    else if (type === "cities") Model = City;
    else if (type === "towns") Model = Town;
    else {
      return res.status(400).json({
        success: false,
        message: "Invalid settlement type",
      });
    }

    const settlement = await Model.findOne({ slug });
    if (!settlement) {
      return res.status(404).json({
        success: false,
        message: "Settlement not found",
      });
    }

    // Get district slug if not present
    let districtSlug = settlement.districtSlug;
    if (!districtSlug && settlement.district) {
      const district = await District.findOne({ name: settlement.district });
      districtSlug = district?.slug;
    }

    // Get taluka slug if not present
    let talukaSlug = settlement.talukaSlug;
    if (!talukaSlug && settlement.taluka) {
      const taluka = await Taluka.findOne({ name: settlement.taluka });
      talukaSlug = taluka?.slug;
    }

    res.status(200).json({
      success: true,
      data: {
        division: settlement.division,
        districtSlug: districtSlug,
        talukaSlug: talukaSlug,
        type: type,
        slug: settlement.slug,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
