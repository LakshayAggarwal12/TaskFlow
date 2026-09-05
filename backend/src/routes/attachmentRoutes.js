const express = require("express");
const { deleteAttachment } = require("../controllers/attachmentController");
const { protect } = require("../middleware/authMiddleware");
const { requireAttachmentAccess, requireAttachmentOwnerOrAdmin } = require("../middleware/attachmentMiddleware");

const router = express.Router();
router.use(protect);

// Mounted at /api/attachments
router.route("/:id").delete(requireAttachmentAccess, requireAttachmentOwnerOrAdmin, deleteAttachment);

module.exports = router;