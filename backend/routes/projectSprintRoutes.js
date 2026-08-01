const express = require("express");
const { createSprint, getProjectSprints } = require("../controllers/sprintController");
const { protect } = require("../middleware/authMiddleware");
const { requireProjectAccess, requireProjectRole } = require("../middleware/projectMiddleware");

const router = express.Router({ mergeParams: true });
router.use(protect);

// Mounted at /api/projects/:projectId/sprints
router.route("/")
  .post(requireProjectAccess, requireProjectRole("member"), createSprint)
  .get(requireProjectAccess, getProjectSprints);

module.exports = router;
