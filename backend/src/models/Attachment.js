const mongoose = require("mongoose");

// Generic attachment record — reused by general task attachments (Phase 2)
// and task-completion submissions (Phase 3), instead of two separate schemas
// and two separate upload code paths.
const attachmentSchema = new mongoose.Schema(
  {
    ownerType: {
      type: String,
      enum: ["task", "submission"],
      required: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    publicId: {
      // Cloudinary's identifier — needed to delete the file from storage later
      type: String,
      required: true,
    },
    filename: {
      type: String,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

attachmentSchema.index({ ownerType: 1, ownerId: 1 });

module.exports = mongoose.model("Attachment", attachmentSchema);