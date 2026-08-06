import mongoose from "mongoose";

const schoolSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    board: {
      type: String,
      required: true,
    },
    district: String,
    taluka: String,
    division: String,
    city: String,
    town: String,
    village: String,
    medium: String,
    address: String,
    schoolType: {
      type: String,
      required: true,
    },
    educationLevel: {
      type: String,
      required: true,
    },
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

schoolSchema.pre("save", function () {
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }
});

export default mongoose.models.School || mongoose.model("School", schoolSchema);
