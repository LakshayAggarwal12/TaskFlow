const Attachment = require("../models/Attachment");
const Task = require("../models/Task");
const List = require("../models/List");
const Board = require("../models/Board");
const resolveProjectRole = require("../utils/resolveProjectRole");
const { ROLE_RANK } = require("./workspaceMiddleware");

// Loads the attachment, walks up its owning task -> list -> board -> project
// to resolve the user's effective role, and flags whether the requester is
// the one who uploaded it. Only supports ownerType "task" for now — Phase 3
// will extend this once submissions have their own attachments.
// Attaches req.attachment, req.task, req.effectiveRole, req.isUploader.
const requireAttachmentAccess = async (req, res, next) => {
  try {
    const attachment = await Attachment.findById(req.params.id);
    if (!attachment) {
      return res.status(404).json({ message: "Attachment not found" });
    }

    if (attachment.ownerType !== "task") {
      return res.status(400).json({ message: "Unsupported attachment owner type" });
    }

    const task = await Task.findById(attachment.ownerId);
    if (!task) {
      return res.status(404).json({ message: "Parent task not found" });
    }

    const list = await List.findById(task.list);
    const board = await Board.findById(list.board);
    const { project, workspace, effectiveRole } = await resolveProjectRole(board.project, req.user._id);

    req.attachment = attachment;
    req.task = task;
    req.project = project;
    req.workspace = workspace;
    req.effectiveRole = effectiveRole;
    req.isUploader = attachment.uploadedBy.toString() === req.user._id.toString();

    next();
  } catch (error) {
    return res.status(error.status || 400).json({ message: error.message || "Invalid attachment id" });
  }
};

// Allows the action if the requester uploaded the file OR holds admin+ on the project
const requireAttachmentOwnerOrAdmin = (req, res, next) => {
  if (req.isUploader || ROLE_RANK[req.effectiveRole] >= ROLE_RANK.admin) {
    return next();
  }
  return res.status(403).json({ message: "You can only delete attachments you uploaded" });
};

module.exports = { requireAttachmentAccess, requireAttachmentOwnerOrAdmin };