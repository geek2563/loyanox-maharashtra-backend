import mongoose from "mongoose";

const populationSchema = new mongoose.Schema(
  {
    year: {
      type: Number,
      required: true,
      unique: true,
    },
    population: {
      type: Number,
      required: true,
    },
    state: {
      type: String,
      default: "Maharashtra",
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.Population ||
  mongoose.model("Population", populationSchema);
