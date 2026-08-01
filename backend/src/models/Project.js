const mongoose = require("mongoose");

const projectMemberSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "member", "viewer"],
      required: true,
    },
  },
  { _id: false }
);

const projectSchema = new mongoose.Schema(
  {
    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Project name is required"],
      trim: true,
      minlength: [2, "Project name must be at least 2 characters"],
      maxlength: [60, "Project name cannot exceed 60 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [300, "Description cannot exceed 300 characters"],
      default: "",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Optional per-project overrides. If a user has no entry here,
    // their WORKSPACE role applies by default (permission inheritance).
    // If they DO have an entry here, it overrides the workspace role
    // for this project only.
    memberOverrides: {
      type: [projectMemberSchema],
      default: [],
    },
    archived: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

projectSchema.index({ workspace: 1 });

// Returns any project-level override role for this user, or null if none exists
projectSchema.methods.getOverrideRole = function (userId) {
  const override = this.memberOverrides.find((m) => m.user.toString() === userId.toString());
  return override ? override.role : null;
};

module.exports = mongoose.model("Project", projectSchema);
