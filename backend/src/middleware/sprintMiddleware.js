const Sprint = require("../models/Sprint");
const resolveProjectRole = require("../utils/resolveProjectRole");
const { ROLE_RANK } = require("./workspaceMiddleware");

// Loads the sprint from :id, resolves the user's effective role via its
// parent project. Attaches req.sprint, req.project, req.workspace, req.effectiveRole.
const requireSprintAccess = async (req, res, next) => {
  try {
    const sprintId = req.params.sprintId || req.params.id;
    const sprint = await Sprint.findById(sprintId);
    if (!sprint) {
      return res.status(404).json({ message: "Sprint not found" });
    }

    const { project, workspace, effectiveRole } = await resolveProjectRole(sprint.project, req.user._id);

    req.sprint = sprint;
    req.project = project;
    req.workspace = workspace;
    req.effectiveRole = effectiveRole;
    next();
  } catch (error) {
    return res.status(error.status || 400).json({ message: error.message || "Invalid sprint id" });
  }
};

const requireSprintRole = (minRole) => {
  return (req, res, next) => {
    if (ROLE_RANK[req.effectiveRole] < ROLE_RANK[minRole]) {
      return res.status(403).json({
        message: `This action requires '${minRole}' role or higher on this sprint's project`,
      });
    }
    next();
  };
};

module.exports = { requireSprintAccess, requireSprintRole };
