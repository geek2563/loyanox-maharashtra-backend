import mongoose from "mongoose";

const talukaSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },

    name: String,

    division: {
      type: String,
      required: true,
      index: true,
    },

    district: {
      type: String,
      required: true,
      index: true,
    },

    villages: Number,
    cities: Number,
    towns: Number,

    population: String,

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

export default mongoose.models.Taluka || mongoose.model("Taluka", talukaSchema);
