const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    actor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Short machine-readable action key, e.g. "task.created", "task.moved", "comment.added"
    action: {
      type: String,
      required: true,
    },
    targetType: {
      type: String,
      enum: ["Project", "Board", "List", "Task", "Comment", "Sprint"],
      required: true,
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    // Pre-rendered human-readable message, e.g. "moved 'Fix login bug' to Done"
    // Stored rather than recomputed on read, so the feed stays fast and stable
    // even if the target document is later renamed or deleted.
    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Feed queries always filter by project and sort newest-first
activitySchema.index({ project: 1, createdAt: -1 });

module.exports = mongoose.model("Activity", activitySchema);
