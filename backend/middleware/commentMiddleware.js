const Comment = require("../models/Comment");
const Task = require("../models/Task");
const List = require("../models/List");
const Board = require("../models/Board");
const resolveProjectRole = require("../utils/resolveProjectRole");
const { ROLE_RANK } = require("./workspaceMiddleware");

// Loads the comment, walks up task -> list -> board -> project to resolve
// the user's effective role, and flags whether the requester is the author.
// Attaches req.comment, req.task, req.effectiveRole, req.isCommentAuthor.
const requireCommentAccess = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const task = await Task.findById(comment.task);
    const list = await List.findById(task.list);
    const board = await Board.findById(list.board);
    const { project, workspace, effectiveRole } = await resolveProjectRole(board.project, req.user._id);

    req.comment = comment;
    req.task = task;
    req.project = project;
    req.workspace = workspace;
    req.effectiveRole = effectiveRole;
    req.isCommentAuthor = comment.author.toString() === req.user._id.toString();

    next();
  } catch (error) {
    return res.status(error.status || 400).json({ message: error.message || "Invalid comment id" });
  }
};

// Allows the action if the requester wrote the comment OR holds admin+ on the project
const requireCommentOwnerOrAdmin = (req, res, next) => {
  if (req.isCommentAuthor || ROLE_RANK[req.effectiveRole] >= ROLE_RANK.admin) {
    return next();
  }
  return res.status(403).json({ message: "You can only edit or delete your own comments" });
};

module.exports = { requireCommentAccess, requireCommentOwnerOrAdmin };
