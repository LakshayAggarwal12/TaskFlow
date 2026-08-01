const express = require("express");
const { addComment, getTaskComments } = require("../controllers/commentController");
const { protect } = require("../middleware/authMiddleware");
const { requireTaskAccess, requireTaskRole } = require("../middleware/taskMiddleware");

const router = express.Router({ mergeParams: true });
router.use(protect);

// Mounted at /api/tasks/:taskId/comments
router.route("/")
  .post(requireTaskAccess, requireTaskRole("member"), addComment)
  .get(requireTaskAccess, getTaskComments);

module.exports = router;
