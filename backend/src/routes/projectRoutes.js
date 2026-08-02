const express = require("express");
const {
  getProject,
  updateProject,
  deleteProject,
  setMemberOverride,
  removeMemberOverride,
} = require("../controllers/projectController");
const { getProjectActivity } = require("../controllers/activityController");
const { protect } = require("../middleware/authMiddleware");
const { requireProjectAccess, requireProjectRole } = require("../middleware/projectMiddleware");
const projectBoardRoutes = require("./projectBoardRoutes");

const router = express.Router();

router.use(protect);

// Mounted at /api/projects
router.route("/:id")
  .get(requireProjectAccess, getProject)
  .patch(requireProjectAccess, requireProjectRole("admin"), updateProject)
  .delete(requireProjectAccess, requireProjectRole("admin"), deleteProject);

router.route("/:id/overrides")
  .post(requireProjectAccess, requireProjectRole("admin"), setMemberOverride);

router.route("/:id/overrides/:memberId")
  .delete(requireProjectAccess, requireProjectRole("admin"), removeMemberOverride);

router.route("/:id/activity")
  .get(requireProjectAccess, getProjectActivity);

// Nested: /api/projects/:projectId/boards
router.use("/:projectId/boards", projectBoardRoutes);

module.exports = router;
