import Population from "../models/PopulationModel.js";
import {
  getAll,
  createOne,
  updateOne,
  deleteOne,
} from "./factoryController.js";

export const getPopulations = getAll(Population);
export const createPopulation = createOne(Population);

// Custom handlers that work with year instead of slug/id
export const getPopulation = async (req, res) => {
  try {
    const { year } = req.params;
    const data = await Population.findOne({ year });

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Population data for this year not found",
      });
    }

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updatePopulation = async (req, res) => {
  try {
    const { year } = req.params;
    const data = await Population.findOneAndUpdate({ year }, req.body, {
      new: true,
      runValidators: true,
    });

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Population data for this year not found",
      });
    }

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const deletePopulation = async (req, res) => {
  try {
    const { year } = req.params;
    const data = await Population.findOneAndDelete({ year });

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Population data for this year not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
