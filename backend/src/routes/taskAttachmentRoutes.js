const express = require("express");
const { uploadAttachment, getTaskAttachments } = require("../controllers/attachmentController");
const { protect } = require("../middleware/authMiddleware");
const { requireTaskAccess, requireTaskRole } = require("../middleware/taskMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router({ mergeParams: true });
router.use(protect);

// Mounted at /api/tasks/:taskId/attachments
router
  .route("/")
  .post(requireTaskAccess, requireTaskRole("member"), upload.single("file"), uploadAttachment)
  .get(requireTaskAccess, getTaskAttachments);

module.exports = router;