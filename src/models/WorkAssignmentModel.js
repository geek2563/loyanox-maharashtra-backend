import mongoose from "mongoose";

const workAssignmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      enum: ["superadmin", "admin", "editor", "viewer"],
      required: true,
    },
    assignmentType: {
      type: String,
      enum: [
        "add_divisions",
        "division",
        "district",
        "taluka",
        "settlement_type",
        "institution_type",
      ],
      required: true,
    },
    assignedRegion: {
      type: String,
      required: function () {
        return ["division", "district", "taluka"].includes(this.assignmentType);
      },
    },
    assignedDivision: {
      type: String,
      required: false,
    },
    assignedDistrict: {
      type: String,
      required: false,
    },
    assignedTaluka: {
      type: String,
      required: false,
    },
    settlementSlug: {
      type: String,
      required: false,
    },
    taskDescription: {
      type: String,
      required: function () {
        return this.assignmentType === "add_divisions";
      },
    },
    settlementType: {
      type: String,
      enum: ["villages", "cities", "towns"],
      required: function () {
        return this.assignmentType === "settlement_type";
      },
    },
    institutionType: {
      type: String,
      enum: ["hospitals", "schools", "colleges"],
      required: function () {
        return this.assignmentType === "institution_type";
      },
    },
    permissions: {
      canCreate: { type: Boolean, default: true },
      canEdit: { type: Boolean, default: true },
      canDelete: { type: Boolean, default: false },
      canView: { type: Boolean, default: true },
    },
    status: {
      type: String,
      enum: ["active", "inactive", "suspended"],
      default: "active",
    },
    notes: String,
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: Date,
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.WorkAssignment ||
  mongoose.model("WorkAssignment", workAssignmentSchema);
