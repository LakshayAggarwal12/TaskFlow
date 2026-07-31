const Project = require("../models/Project");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");

// @route   POST /api/workspaces/:workspaceId/projects
// @access  Private (workspace member, role >= member)
const createProject = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Project name is required" });
  }

  const project = await Project.create({
    workspace: req.workspace._id,
    name,
    description,
    createdBy: req.user._id,
  });

  res.status(201).json({ success: true, project });
});

// @route   GET /api/workspaces/:workspaceId/projects
// @access  Private (workspace member)
const getWorkspaceProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find({ workspace: req.workspace._id, archived: false })
    .populate("createdBy", "name email avatarUrl")
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, count: projects.length, projects });
});

// @route   GET /api/projects/:id
// @access  Private (project access via requireProjectAccess)
const getProject = asyncHandler(async (req, res) => {
  const project = await req.project.populate([
    { path: "createdBy", select: "name email avatarUrl" },
    { path: "memberOverrides.user", select: "name email avatarUrl" },
  ]);

  res.status(200).json({ success: true, project, yourRole: req.effectiveRole });
});

// @route   PATCH /api/projects/:id
// @access  Private (effective role >= admin)
const updateProject = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (name) req.project.name = name;
  if (description !== undefined) req.project.description = description;

  await req.project.save();

  res.status(200).json({ success: true, project: req.project });
});

// @route   DELETE /api/projects/:id
// @access  Private (effective role >= admin)
// Soft-delete: keeps the document (and its future boards/tasks) but hides it
const deleteProject = asyncHandler(async (req, res) => {
  req.project.archived = true;
  await req.project.save();

  res.status(200).json({ success: true, message: "Project archived" });
});

// @route   POST /api/projects/:id/overrides
// @access  Private (effective role >= admin)
// Sets or updates a project-level role override for a workspace member
const setMemberOverride = asyncHandler(async (req, res) => {
  const { email, role } = req.body;

  if (!email || !["admin", "member", "viewer"].includes(role)) {
    return res.status(400).json({ message: "Provide a valid email and role (admin, member, viewer)" });
  }

  const targetUser = await User.findOne({ email: email.toLowerCase() });
  if (!targetUser) {
    return res.status(404).json({ message: "No user found with that email" });
  }

  const workspaceRole = req.workspace.getMemberRole(targetUser._id);
  if (!workspaceRole) {
    return res.status(400).json({ message: "User must be a workspace member before setting a project override" });
  }

  const existing = req.project.memberOverrides.find(
    (m) => m.user.toString() === targetUser._id.toString()
  );

  if (existing) {
    existing.role = role;
  } else {
    req.project.memberOverrides.push({ user: targetUser._id, role });
  }

  await req.project.save();

  res.status(200).json({ success: true, project: req.project });
});

// @route   DELETE /api/projects/:id/overrides/:memberId
// @access  Private (effective role >= admin)
// Removes an override so the user falls back to their plain workspace role
const removeMemberOverride = asyncHandler(async (req, res) => {
  const { memberId } = req.params;

  req.project.memberOverrides = req.project.memberOverrides.filter(
    (m) => m.user.toString() !== memberId
  );
  await req.project.save();

  res.status(200).json({ success: true, project: req.project });
});

module.exports = {
  createProject,
  getWorkspaceProjects,
  getProject,
  updateProject,
  deleteProject,
  setMemberOverride,
  removeMemberOverride,
};
