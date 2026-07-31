const Project = require("../models/Project");
const Workspace = require("../models/Workspace");

// Core permission logic, extracted so board/list/task middleware can resolve
// "does this user have access, and at what role" without duplicating it.
// Returns { project, workspace, effectiveRole } or throws an Error with a
// `.status` code the calling middleware can use directly in its response.
const resolveProjectRole = async (projectId, userId) => {
  const project = await Project.findById(projectId);
  if (!project || project.archived) {
    const err = new Error("Project not found");
    err.status = 404;
    throw err;
  }

  const workspace = await Workspace.findById(project.workspace);
  if (!workspace) {
    const err = new Error("Parent workspace not found");
    err.status = 404;
    throw err;
  }

  const workspaceRole = workspace.getMemberRole(userId);
  if (!workspaceRole) {
    const err = new Error("You are not a member of this project's workspace");
    err.status = 403;
    throw err;
  }

  let effectiveRole = workspaceRole;
  if (workspaceRole === "member" || workspaceRole === "viewer") {
    const override = project.getOverrideRole(userId);
    if (override) effectiveRole = override;
  }

  return { project, workspace, effectiveRole };
};

module.exports = resolveProjectRole;
