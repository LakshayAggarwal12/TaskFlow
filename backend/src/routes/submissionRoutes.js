const express = require("express");
const { reviewSubmission } = require("../controllers/submissionController");
const { protect } = require("../middleware/authMiddleware");
const { requireSubmissionAccess } = require("../middleware/submissionMiddleware");
const { requireTaskRole } = require("../middleware/taskMiddleware");

const router = express.Router();
router.use(protect);

// Mounted at /api/submissions — reviewing is an admin+ action, same bar as deleteTask
router.route("/:id/review").patch(requireSubmissionAccess, requireTaskRole("admin"), reviewSubmission);

module.exports = router;