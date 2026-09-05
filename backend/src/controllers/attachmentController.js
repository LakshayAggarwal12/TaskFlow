const { Readable } = require("stream");
const path = require("path");
const crypto = require("crypto");

const cloudinary = require("../config/cloudinary");
const Attachment = require("../models/Attachment");
const asyncHandler = require("../utils/asyncHandler");
const logActivity = require("../utils/logActivity");
const { validateFile } = require("../utils/fileValidation");
const logger = require("../config/logger");

/**
 * Determine the correct Cloudinary resource type.
 *
 * Cloudinary:
 * - Images  -> image
 * - Videos  -> video
 * - Audio   -> video
 * - PDFs    -> image
 * - Other files (docx, zip, etc.) -> raw
 */
const getResourceType = (mimetype) => {
  if (mimetype.startsWith("image/")) {
    return "image";
  }

  if (mimetype.startsWith("video/")) {
    return "video";
  }

  if (mimetype.startsWith("audio/")) {
    return "video";
  }

  if (mimetype === "application/pdf") {
    return "image";
  }

  return "raw";
};

/**
 * Upload a buffer directly to Cloudinary.
 * No temporary file is created on disk.
 */
const streamToCloudinary = (buffer, options) =>
  new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) {
          logger.error("Cloudinary upload failed", {
            message: error.message,
            http_code: error.http_code,
            error,
          });

          return reject(error);
        }

        resolve(result);
      }
    );

    uploadStream.on("error", (error) => {
      logger.error("Cloudinary stream error", {
        message: error.message,
      });

      reject(error);
    });

    Readable.from(buffer).pipe(uploadStream);
  });


// @route POST /api/tasks/:taskId/attachments
// @access Private
const uploadAttachment = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      message: "No file was provided",
    });
  }

  // Validate file before uploading
  const { ok, reason } = validateFile({
    mimetype: req.file.mimetype,
    size: req.file.size,
    filename: req.file.originalname,
  });

  if (!ok) {
    return res.status(400).json({
      message: reason,
    });
  }

  const resourceType = getResourceType(req.file.mimetype);

  /**
   * Generate a safe and unique public ID for raw files.
   *
   * Raw Cloudinary resources should retain their file extension.
   * Example:
   * report.pdf -> report-uuid.pdf
   */
  let publicId;

  if (resourceType === "raw") {
    const extension = path.extname(req.file.originalname);
    const filenameWithoutExtension = path.basename(
      req.file.originalname,
      extension
    );

    const safeFilename = filenameWithoutExtension
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .replace(/_+/g, "_")
      .substring(0, 100);

    publicId = `${safeFilename}-${crypto.randomUUID()}${extension}`;
  }

  const uploadOptions = {
    folder: `taskflow/tasks/${req.task._id}`,
    resource_type: resourceType,
  };

  if (publicId) {
    uploadOptions.public_id = publicId;
  }

  const result = await streamToCloudinary(
    req.file.buffer,
    uploadOptions
  );

  // Save Cloudinary information in MongoDB
  const attachment = await Attachment.create({
    ownerType: "task",
    ownerId: req.task._id,
    uploadedBy: req.user._id,

    url: result.secure_url,
    publicId: result.public_id,

    filename: req.file.originalname,
    mimeType: req.file.mimetype,
    size: req.file.size,
  });

  await attachment.populate(
    "uploadedBy",
    "name email avatarUrl"
  );

  // Log activity
  await logActivity({
    project: req.project._id,
    actor: req.user._id,
    action: "attachment.added",
    targetType: "Attachment",
    targetId: attachment._id,
    message: `${req.user.name} attached "${req.file.originalname}" to "${req.task.title}"`,
  });

  return res.status(201).json({
    success: true,
    attachment,
  });
});


// @route GET /api/tasks/:taskId/attachments
// @access Private
const getTaskAttachments = asyncHandler(async (req, res) => {
  const attachments = await Attachment.find({
    ownerType: "task",
    ownerId: req.task._id,
  })
    .sort({ createdAt: -1 })
    .populate("uploadedBy", "name email avatarUrl");

  return res.status(200).json({
    success: true,
    count: attachments.length,
    attachments,
  });
});


// @route DELETE /api/attachments/:id
// @access Private
const deleteAttachment = asyncHandler(async (req, res) => {
  try {
    const resourceType = getResourceType(
      req.attachment.mimeType
    );

    await cloudinary.uploader.destroy(
      req.attachment.publicId,
      {
        resource_type: resourceType,
      }
    );
  } catch (error) {
    logger.warn("Cloudinary delete failed, removing DB record anyway", {
      publicId: req.attachment.publicId,
      message: error.message,
      http_code: error.http_code,
    });
  }

  await req.attachment.deleteOne();

  return res.status(200).json({
    success: true,
    message: "Attachment deleted",
  });
});


module.exports = {
  uploadAttachment,
  getTaskAttachments,
  deleteAttachment,
};