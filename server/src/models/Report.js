import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    // 🔹 User who created the report
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true
    },

    imageUrl: {
      type: String
    },

    // 🔹 Workflow status
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "in_progress", "resolved", "rejected"]
    },

    // 🔹 AI-classified department
    department: {
      type: String,
      index: true
    },

    // 🔹 AI severity label
    severityLevel: {
      type: String,
      enum: ["Minor", "Moderate", "Severe"],
      default: "Minor"
    },

    // 🔹 Numeric severity score (0–1)
    severityScore: {
      type: Number,
      min: 0,
      max: 1
    },

    // 🔹 SLA urgency
    slaHours: Number,

    slaDeadline: Date,

    // 🔹 AI flags / alerts
    flags: {
      type: [String],
      default: []
    },

    // 🔹 AI processing status
    aiProcessed: {
      type: Boolean,
      default: false
    },

    // 🔹 Location info
    location: String,
    latitude: Number,
    longitude: Number
  },
  { timestamps: true }
);

export default mongoose.model("Report", reportSchema);
