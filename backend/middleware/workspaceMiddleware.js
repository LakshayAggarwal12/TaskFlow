const Workspace = require("../models/Workspace");

// Role hierarchy — higher index = more privilege
const ROLE_RANK = { viewer: 0, member: 1, admin: 2, owner: 3 };

// Loads the workspace from :workspaceId (or :id, if the route itself IS
// the workspace route) and confirms req.user is a member of it.
// Attaches `req.workspace` and `req.memberRole` for downstream handlers.
const requireWorkspaceMember = async (req, res, next) => {
  try {
    const workspaceId = req.params.workspaceId || req.params.id;
    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    const role = workspace.getMemberRole(req.user._id);
    if (!role) {
      return res.status(403).json({ message: "You are not a member of this workspace" });
    }

    req.workspace = workspace;
    req.memberRole = role;
    next();
  } catch (error) {
    return res.status(400).json({ message: "Invalid workspace id" });
  }
};

// Use AFTER requireWorkspaceMember. Ensures req.memberRole meets a minimum rank.
// e.g. requireWorkspaceRole("admin") allows admin and owner, blocks member/viewer.
const requireWorkspaceRole = (minRole) => {
  return (req, res, next) => {
    if (ROLE_RANK[req.memberRole] < ROLE_RANK[minRole]) {
      return res.status(403).json({
        message: `This action requires '${minRole}' role or higher in the workspace`,
      });
    }
    next();
  };
};

module.exports = { requireWorkspaceMember, requireWorkspaceRole, ROLE_RANK };
