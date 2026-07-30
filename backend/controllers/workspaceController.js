const Workspace = require("../models/Workspace");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");

// @route   POST /api/workspaces
// @access  Private
const createWorkspace = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Workspace name is required" });
  }

  const workspace = await Workspace.create({
    name,
    description,
    owner: req.user._id,
    members: [{ user: req.user._id, role: "owner" }],
  });

  res.status(201).json({ success: true, workspace });
});

// @route   GET /api/workspaces
// @access  Private
// Returns every workspace the logged-in user belongs to (any role)
const getMyWorkspaces = asyncHandler(async (req, res) => {
  const workspaces = await Workspace.find({ "members.user": req.user._id })
    .populate("owner", "name email avatarUrl")
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, count: workspaces.length, workspaces });
});

// @route   GET /api/workspaces/:id
// @access  Private (member only — enforced by requireWorkspaceMember middleware)
const getWorkspace = asyncHandler(async (req, res) => {
  // req.workspace was already loaded by requireWorkspaceMember
  const workspace = await req.workspace.populate([
    { path: "owner", select: "name email avatarUrl" },
    { path: "members.user", select: "name email avatarUrl" },
  ]);

  res.status(200).json({ success: true, workspace });
});

// @route   PATCH /api/workspaces/:id
// @access  Private (admin or owner only)
const updateWorkspace = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (name) req.workspace.name = name;
  if (description !== undefined) req.workspace.description = description;

  await req.workspace.save();

  res.status(200).json({ success: true, workspace: req.workspace });
});

// @route   DELETE /api/workspaces/:id
// @access  Private (owner only)
const deleteWorkspace = asyncHandler(async (req, res) => {
  if (req.memberRole !== "owner") {
    return res.status(403).json({ message: "Only the workspace owner can delete it" });
  }

  await req.workspace.deleteOne();

  res.status(200).json({ success: true, message: "Workspace deleted" });
  // Note: once Project/Board/Task models exist, cascade-delete their
  // documents referencing this workspaceId here as well.
});

// @route   POST /api/workspaces/:id/members
// @access  Private (admin or owner only)
const addMember = asyncHandler(async (req, res) => {
  const { email, role = "member" } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required to add a member" });
  }

  const userToAdd = await User.findOne({ email: email.toLowerCase() });
  if (!userToAdd) {
    return res.status(404).json({ message: "No user found with that email" });
  }

  const alreadyMember = req.workspace.members.some(
    (m) => m.user.toString() === userToAdd._id.toString()
  );
  if (alreadyMember) {
    return res.status(400).json({ message: "User is already a member of this workspace" });
  }

  req.workspace.members.push({ user: userToAdd._id, role });
  await req.workspace.save();

  res.status(200).json({ success: true, workspace: req.workspace });
});

// @route   PATCH /api/workspaces/:id/members/:memberId
// @access  Private (admin or owner only)
const updateMemberRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  const { memberId } = req.params;

  if (!["admin", "member", "viewer"].includes(role)) {
    return res.status(400).json({ message: "Role must be one of: admin, member, viewer" });
  }

  const member = req.workspace.members.find((m) => m.user.toString() === memberId);
  if (!member) {
    return res.status(404).json({ message: "Member not found in this workspace" });
  }

  if (member.role === "owner") {
    return res.status(400).json({ message: "Cannot change the owner's role" });
  }

  member.role = role;
  await req.workspace.save();

  res.status(200).json({ success: true, workspace: req.workspace });
});

// @route   DELETE /api/workspaces/:id/members/:memberId
// @access  Private (admin or owner only)
const removeMember = asyncHandler(async (req, res) => {
  const { memberId } = req.params;

  const member = req.workspace.members.find((m) => m.user.toString() === memberId);
  if (!member) {
    return res.status(404).json({ message: "Member not found in this workspace" });
  }

  if (member.role === "owner") {
    return res.status(400).json({ message: "The owner cannot be removed from the workspace" });
  }

  req.workspace.members = req.workspace.members.filter(
    (m) => m.user.toString() !== memberId
  );
  await req.workspace.save();

  res.status(200).json({ success: true, workspace: req.workspace });
});

module.exports = {
  createWorkspace,
  getMyWorkspaces,
  getWorkspace,
  updateWorkspace,
  deleteWorkspace,
  addMember,
  updateMemberRole,
  removeMember,
};
