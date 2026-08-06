import mongoose from "mongoose";

const hospitalSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    hospitalType: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    district: String,
    taluka: String,
    division: String,
    city: String,
    town: String,
    village: String,
    beds: {
      type: Number,
      required: true,
    },
    address: String,
    email: String,
    phone: String,
    website: String,
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    lat: Number,
    lng: Number,
  },
  {
    timestamps: true,
  },
);

hospitalSchema.pre("save", function () {
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }
});

export default mongoose.models.Hospital ||
  mongoose.model("Hospital", hospitalSchema);
