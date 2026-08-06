import Village from "../models/VillageModel.js";
import Division from "../models/DivisionModel.js";
import District from "../models/DistrictModel.js";
import Taluka from "../models/TalukaModel.js";
import City from "../models/CityModel.js";
import Town from "../models/TownModel.js";
import Hospital from "../models/HospitalModel.js";
import School from "../models/SchoolModel.js";
import College from "../models/CollegeModel.js";
export const getDashboardStats = async (req, res) => {
  try {
    const [
      villages,
      divisions,
      districts,
      talukas,
      cities,
      towns,
      hospitals,
      schools,
      colleges,
    ] = await Promise.all([
      Village.countDocuments(),
      Division.countDocuments(),
      District.countDocuments(),
      Taluka.countDocuments(),
      City.countDocuments(),
      Town.countDocuments(),
      Hospital.countDocuments(),
      School.countDocuments(),
      College.countDocuments(),
    ]);

    res.status(200).json({
      success: true,
      data: {
        villages,
        divisions,
        districts,
        talukas,
        cities,
        towns,
        hospitals,
        schools,
        colleges,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
