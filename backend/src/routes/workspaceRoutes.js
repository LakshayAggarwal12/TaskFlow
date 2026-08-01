const express = require("express");
const {
  createWorkspace,
  getMyWorkspaces,
  getWorkspace,
  updateWorkspace,
  deleteWorkspace,
  addMember,
  updateMemberRole,
  removeMember,
} = require("../src/controllers/workspaceController");
const { protect } = require("../src/middleware/authMiddleware");
const { requireWorkspaceMember, requireWorkspaceRole } = require("../src/middleware/workspaceMiddleware");

const router = express.Router();

// Every workspace route requires a logged-in user
router.use(protect);

router.route("/")
  .post(createWorkspace)
  .get(getMyWorkspaces);

router.route("/:id")
  .get(requireWorkspaceMember, getWorkspace)
  .patch(requireWorkspaceMember, requireWorkspaceRole("admin"), updateWorkspace)
  .delete(requireWorkspaceMember, requireWorkspaceRole("owner"), deleteWorkspace);

router.route("/:id/members")
  .post(requireWorkspaceMember, requireWorkspaceRole("admin"), addMember);

router.route("/:id/members/:memberId")
  .patch(requireWorkspaceMember, requireWorkspaceRole("admin"), updateMemberRole)
  .delete(requireWorkspaceMember, requireWorkspaceRole("admin"), removeMember);

module.exports = router;
