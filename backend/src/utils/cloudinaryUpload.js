const { Readable } = require("stream");
const path = require("path");
const crypto = require("crypto");
const cloudinary = require("../config/cloudinary");
const logger = require("../config/logger");

// Cloudinary resource type for a given mimetype. Same rules the task
// attachment controller uses: PDFs go in as "image" (so Cloudinary can
// serve/preview them), audio is stored as "video", everything else "raw".
const getResourceType = (mimetype = "") => {
  if (mimetype.startsWith("image/")) return "image";
  if (mimetype.startsWith("video/") || mimetype.startsWith("audio/")) return "video";
  if (mimetype === "application/pdf") return "image";
  return "raw";
};

// Raw files keep their extension in the public ID (Cloudinary serves raw
// files exactly at that ID) and get a UUID so two files with the same name
// never overwrite each other. Other resource types get a generated ID.
// report.docx -> report-<uuid>.docx
const buildPublicId = (originalname, resourceType) => {
  if (resourceType !== "raw") return undefined;
  const extension = path.extname(originalname);
  const base = path
    .basename(originalname, extension)
    .replace(/[^a-zA-Z0-9_-]/g, "_")
    .replace(/_+/g, "_")
    .substring(0, 100);
  return `${base}-${crypto.randomUUID()}${extension}`;
};

// Streams a buffer straight to Cloudinary — no temp file on disk.
const streamToCloudinary = (buffer, options) =>
  new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) {
        logger.error("Cloudinary upload failed", { message: error.message, http_code: error.http_code });
        return reject(error);
      }
      resolve(result);
    });
    uploadStream.on("error", reject);
    Readable.from(buffer).pipe(uploadStream);
  });

module.exports = { getResourceType, buildPublicId, streamToCloudinary };