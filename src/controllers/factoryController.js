import mongoose from "mongoose";
import APIFeatures from "../utils/APIFeatures.js";
import asyncHandler from "../middleware/asyncHandler.js";

export const getAll = (Model) =>
  asyncHandler(async (req, res) => {
    const total = await Model.countDocuments();

    const features = new APIFeatures(Model.find(), req.query)
      .filter()
      .search()
      .sort()
      .limitFields()
      .paginate();

    const data = await features.query;

    res.status(200).json({
      success: true,
      total,
      count: data.length,
      data,
    });
  });

export const getOne = (Model) => async (req, res) => {
  try {
    const data = await Model.findById(req.params.id);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const createOne = (Model) => async (req, res) => {
  try {
    const data = await Model.create(req.body);

    res.status(201).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const updateOne = (Model) => async (req, res) => {
  try {
    const data = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const updateBySlug = (Model) => async (req, res) => {
  try {
    const { slug: newSlug, ...updateData } = req.body;
    const oldSlugOrId = req.params.slug;
    const isObjectId = mongoose.Types.ObjectId.isValid(oldSlugOrId);
    const query = isObjectId
      ? { $or: [{ slug: oldSlugOrId }, { _id: oldSlugOrId }] }
      : { slug: oldSlugOrId };

    console.log(
      `UpdateBySlug - Model: ${Model.modelName}, Old Identifier: ${oldSlugOrId}, New Slug: ${newSlug}`,
    );
    console.log("Update data:", updateData);

    // Clean up null and undefined values from updateData
    const cleanedData = {};
    for (const key in updateData) {
      if (
        updateData[key] !== null &&
        updateData[key] !== undefined &&
        updateData[key] !== ""
      ) {
        cleanedData[key] = updateData[key];
      }
    }

    // If slug is being updated, check if new slug already exists
    if (newSlug && newSlug !== oldSlugOrId) {
      const existingDoc = await Model.findOne({ slug: newSlug });
      if (existingDoc && existingDoc._id.toString() !== oldSlugOrId) {
        return res.status(400).json({
          success: false,
          message: "A document with this slug already exists",
        });
      }
    }

    // First update without slug to avoid validation issues
    const data = await Model.findOneAndUpdate(
      query,
      cleanedData,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Not Found",
      });
    }

    console.log("Document updated successfully:", data);

    // If slug needs to be changed or set, update it
    if (newSlug && data.slug !== newSlug) {
      data.slug = newSlug;
      await data.save();
      console.log("Slug updated to:", newSlug);
    }

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Error in updateBySlug:", error);
    res.status(400).json({
      message: error.message,
    });
  }
};

export const deleteBySlug = (Model) => async (req, res) => {
  try {
    const slugOrId = req.params.slug;
    const isObjectId = mongoose.Types.ObjectId.isValid(slugOrId);
    const query = isObjectId
      ? { $or: [{ slug: slugOrId }, { _id: slugOrId }] }
      : { slug: slugOrId };

    const data = await Model.findOneAndDelete(query);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Not Found",
      });
    }

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

export const deleteOne = (Model) => async (req, res) => {
  try {
    await Model.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

//getBySlug
export const getBySlug = (Model) => async (req, res) => {
  try {
    const slugOrId = req.params.slug;
    const isObjectId = mongoose.Types.ObjectId.isValid(slugOrId);
    const query = isObjectId
      ? { $or: [{ slug: slugOrId }, { _id: slugOrId }] }
      : { slug: slugOrId };

    const data = await Model.findOne(query);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Not Found",
      });
    }

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
