const express = require("express");
const { updateComment, deleteComment } = require("../src/controllers/commentController");
const { protect } = require("../src/middleware/authMiddleware");
const { requireCommentAccess, requireCommentOwnerOrAdmin } = require("../src/middleware/commentMiddleware");

const router = express.Router();
router.use(protect);

// Mounted at /api/comments
router.route("/:id")
  .patch(requireCommentAccess, requireCommentOwnerOrAdmin, updateComment)
  .delete(requireCommentAccess, requireCommentOwnerOrAdmin, deleteComment);

module.exports = router;
