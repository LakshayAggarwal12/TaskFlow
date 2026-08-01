const resolveProjectRole = require("../utils/resolveProjectRole");
const { ROLE_RANK } = require("./workspaceMiddleware");

// Loads the project from :projectId (or :id), resolves the user's effective
// role (project override falls back to workspace role), and attaches
// req.project, req.workspace, req.effectiveRole for downstream handlers.
const requireProjectAccess = async (req, res, next) => {
  try {
    const projectId = req.params.projectId || req.params.id;
    const { project, workspace, effectiveRole } = await resolveProjectRole(projectId, req.user._id);

    req.project = project;
    req.workspace = workspace;
    req.effectiveRole = effectiveRole;
    next();
  } catch (error) {
    return res.status(error.status || 400).json({ message: error.message || "Invalid project id" });
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
