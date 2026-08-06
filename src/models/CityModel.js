import mongoose from "mongoose";

const citySchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    name: String,
    type: String,
    state: String,
    division: {
      type: String,
      index: true,
    },
    district: String,
    taluka: String,
    talukaSlug: String,
    population: Number,
    malePopulation: Number,
    femalePopulation: Number,
    hospitals: Number,
    schools: Number,
    colleges: Number,
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
    address: String,
    pincodes: [Number],
    lastUpdated: Date,
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.City || mongoose.model("City", citySchema);
