import mongoose from "mongoose";

const districtSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
    },

    division: {
      type: String,
      required: true,
      index: true,
    },

    talukas: Number,

    villages: Number,

    description: String,

    lat: {
      type: Number,
      default: 0,
    },
    lng: {
      type: Number,
      default: 0,
    },
    latitude: Number,
    longitude: Number,
    geojson: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.District ||
  mongoose.model("District", districtSchema);
