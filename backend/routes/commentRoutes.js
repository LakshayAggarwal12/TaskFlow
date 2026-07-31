const express = require("express");
const { updateComment, deleteComment } = require("../controllers/commentController");
const { protect } = require("../middleware/authMiddleware");
const { requireCommentAccess, requireCommentOwnerOrAdmin } = require("../middleware/commentMiddleware");

const router = express.Router();
router.use(protect);

// Mounted at /api/comments
router.route("/:id")
  .patch(requireCommentAccess, requireCommentOwnerOrAdmin, updateComment)
  .delete(requireCommentAccess, requireCommentOwnerOrAdmin, deleteComment);

module.exports = router;
