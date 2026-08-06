import mongoose from "mongoose";

const collegeSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    collegeType: {
      type: String,
      enum: ["Government", "Private", "Aided", "Autonomous", "Deemed"],
      required: true,
    },
    category: {
      type: String,
      enum: [
        "Engineering",
        "Medical",
        "Pharmacy",
        "Arts",
        "Commerce",
        "Science",
        "Polytechnic",
        "ITI",
        "Agriculture",
        "Law",
        "MBA",
        "MCA",
        "Nursing",
      ],
      required: true,
    },
    email: String,
    phone: String,
    website: String,
    address: String,
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    lat: Number,
    lng: Number,
    division: String,
    city: String,
    town: String,
    village: String,
    stream: String,
    district: String,
    taluka: String,
  },
  {
    timestamps: true,
  },
);

collegeSchema.pre("save", function () {
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }
});

export default mongoose.models.College ||
  mongoose.model("College", collegeSchema);
