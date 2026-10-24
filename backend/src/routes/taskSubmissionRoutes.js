const express = require("express");
const { createSubmission, getTaskSubmissions } = require("../controllers/submissionController");
const { protect } = require("../middleware/authMiddleware");
const { requireTaskAccess, requireTaskRole } = require("../middleware/taskMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router({ mergeParams: true });
router.use(protect);

// Mounted at /api/tasks/:taskId/submissions
// Up to 5 files per submission — matches the "short form" scope, not a
// general-purpose bulk uploader.
router
  .route("/")
  .post(requireTaskAccess, requireTaskRole("member"), upload.array("files", 5), createSubmission)
  .get(requireTaskAccess, getTaskSubmissions);

module.exports = router;