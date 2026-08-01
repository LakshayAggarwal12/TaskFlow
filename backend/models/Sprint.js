const mongoose = require("mongoose");

const sprintSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Sprint name is required"],
      trim: true,
      maxlength: [80, "Sprint name cannot exceed 80 characters"],
    },
    goal: {
      type: String,
      trim: true,
      maxlength: [300, "Sprint goal cannot exceed 300 characters"],
      default: "",
    },
    startDate: {
      type: Date,
      required: [true, "Sprint start date is required"],
    },
    endDate: {
      type: Date,
      required: [true, "Sprint end date is required"],
      validate: {
        validator: function (value) {
          return value > this.startDate;
        },
        message: "endDate must be after startDate",
      },
    },
    status: {
      type: String,
      enum: ["planning", "active", "completed"],
      default: "planning",
    },
    // Populated by the AI feature layer when the sprint is closed (Phase 5
    // of the roadmap) — a short human-readable recap generated from the
    // sprint's completed/incomplete tasks. Left empty until that phase.
    aiSummary: {
      type: String,
      default: "",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

sprintSchema.index({ project: 1, startDate: -1 });

module.exports = mongoose.model("Sprint", sprintSchema);
