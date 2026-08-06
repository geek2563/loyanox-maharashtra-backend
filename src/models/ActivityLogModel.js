import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema({
  action: { type: String, required: true },
  entity: { type: String, required: true },
  user: { type: String, default: "Digvijay" },
  type: {
    type: String,
    enum: ["create", "update", "delete", "login", "export"],
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("ActivityLog", activityLogSchema);
