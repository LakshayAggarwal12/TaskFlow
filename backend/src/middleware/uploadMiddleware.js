const multer = require("multer");
const { isTypeAllowed, MAX_FILE_SIZE_BYTES } = require("../utils/fileValidation");

// Memory storage — the file buffer is streamed straight to Cloudinary in the
// controller, never written to local disk (important on ephemeral hosts
// like Render, where the local filesystem isn't persistent anyway).
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // Only the type can be checked here — size isn't known yet until the
  // whole file is buffered, so that's re-checked in the controller.
  const { ok, reason } = isTypeAllowed({ mimetype: file.mimetype, filename: file.originalname });
  if (!ok) {
    return cb(new Error(reason));
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE_BYTES },
});

module.exports = upload;