const express = require("express");
const { createProject, getWorkspaceProjects } = require("../controllers/projectController");
const { protect } = require("../middleware/authMiddleware");
const { requireWorkspaceMember, requireWorkspaceRole } = require("../middleware/workspaceMiddleware");

// mergeParams lets this router read :workspaceId from the parent router (workspaceRoutes)
const router = express.Router({ mergeParams: true });

router.use(protect);

// Mounted at /api/workspaces/:workspaceId/projects
router.route("/")
  .post(requireWorkspaceMember, requireWorkspaceRole("member"), createProject)
  .get(requireWorkspaceMember, getWorkspaceProjects);

module.exports = router;
