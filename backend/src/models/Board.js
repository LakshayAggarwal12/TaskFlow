const mongoose = require("mongoose");

const boardSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Board name is required"],
      trim: true,
      maxlength: [60, "Board name cannot exceed 60 characters"],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

boardSchema.index({ project: 1 });

module.exports = mongoose.model("Board", boardSchema);
