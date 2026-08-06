import mongoose from "mongoose";

const villageSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      unique: true,
    },
    talukaSlug: {
      type: String,
      index: true,
    },
    name: String,
    type: String,
    state: String,
    division: {
      type: String,
      index: true,
    },
    district: {
      type: String,
      index: true,
    },
    taluka: {
      type: String,
      index: true,
    },
    category: {
      type: String,
      enum: ["Village (गाव)", "Wadi (वाडी)", "Vasti (वस्ती)", "Tanda (तांडा)"],
      default: "Village (गाव)",
    },
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

export default mongoose.models.Village ||
  mongoose.model("Village", villageSchema);
