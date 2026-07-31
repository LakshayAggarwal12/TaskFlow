const Project = require("../models/Project");
const Workspace = require("../models/Workspace");
const { ROLE_RANK } = require("./workspaceMiddleware");

// Loads the project from :projectId (or :id), confirms the user is at least
// a workspace member, then resolves their EFFECTIVE role for this project:
// project-level override if one exists, otherwise the workspace-level role.
// Attaches req.project, req.workspace, and req.effectiveRole.
const requireProjectAccess = async (req, res, next) => {
  try {
    const projectId = req.params.projectId || req.params.id;
    const project = await Project.findById(projectId);

    if (!project || project.archived) {
      return res.status(404).json({ message: "Project not found" });
    }

    const workspace = await Workspace.findById(project.workspace);
    if (!workspace) {
      return res.status(404).json({ message: "Parent workspace not found" });
    }

    const workspaceRole = workspace.getMemberRole(req.user._id);
    if (!workspaceRole) {
      return res.status(403).json({ message: "You are not a member of this project's workspace" });
    }

    // Workspace owner/admin always has at least admin-level project access,
    // regardless of overrides — overrides can only apply to plain members.
    let effectiveRole = workspaceRole;
    if (workspaceRole === "member" || workspaceRole === "viewer") {
      const override = project.getOverrideRole(req.user._id);
      if (override) effectiveRole = override;
    }

    req.project = project;
    req.workspace = workspace;
    req.effectiveRole = effectiveRole;
    next();
  } catch (error) {
    return res.status(400).json({ message: "Invalid project id" });
  }
};

const requireProjectRole = (minRole) => {
  return (req, res, next) => {
    if (ROLE_RANK[req.effectiveRole] < ROLE_RANK[minRole]) {
      return res.status(403).json({
        message: `This action requires '${minRole}' role or higher on this project`,
      });
    }
    next();
  };
};

module.exports = { requireProjectAccess, requireProjectRole };
