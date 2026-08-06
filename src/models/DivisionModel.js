import mongoose from "mongoose";

const divisionSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    short: String,
    name: {
      type: String,
      required: true,
      unique: true,
    },
    lat: {
      type: Number,
      default: 0,
    },
    lng: {
      type: Number,
      default: 0,
    },
    latitude: {
      type: Number,
      default: 0,
    },
    longitude: {
      type: Number,
      default: 0,
    },
    latMin: Number,
    latMax: Number,
    lngMin: Number,
    lngMax: Number,
    geojson: {
      type: mongoose.Schema.Types.Mixed,
    },
    districts: Number,
    talukas: Number,
    villages: Number,
    description: String,
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.Division ||
  mongoose.model("Division", divisionSchema);
