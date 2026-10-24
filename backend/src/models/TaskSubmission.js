const mongoose = require("mongoose");

// A record of one "submit for review" action on a task. A task can have
// several of these over time (submit -> changes requested -> resubmit ->
// approved), which doubles as a history/audit trail of completion attempts.
const taskSubmissionSchema = new mongoose.Schema(
  {
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    notes: {
      type: String,
      required: [true, "A short note is required to submit for review"],
      trim: true,
      maxlength: 1000,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "changes_requested"],
      default: "pending",
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    reviewNote: {
      type: String,
      trim: true,
      default: "",
    },
    reviewedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

taskSubmissionSchema.index({ task: 1, createdAt: -1 });

module.exports = mongoose.model("TaskSubmission", taskSubmissionSchema);