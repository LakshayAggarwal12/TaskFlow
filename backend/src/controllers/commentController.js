const Comment = require("../models/Comment");
const asyncHandler = require("../utils/asyncHandler");
const logActivity = require("../utils/logActivity");

// @route   POST /api/tasks/:taskId/comments
// @access  Private (effective role >= member) — req.task/req.project set by requireTaskAccess
const addComment = asyncHandler(async (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ message: "Comment text is required" });
  }

  const comment = await Comment.create({
    task: req.task._id,
    author: req.user._id,
    text,
  });

  await comment.populate("author", "name email avatarUrl");

  logActivity({
    project: req.project._id,
    actor: req.user._id,
    action: "comment.added",
    targetType: "Comment",
    targetId: comment._id,
    message: `${req.user.name} commented on "${req.task.title}"`,
  });

  res.status(201).json({ success: true, comment });
});

// @route   GET /api/tasks/:taskId/comments
// @access  Private (task access)
const getTaskComments = asyncHandler(async (req, res) => {
  const comments = await Comment.find({ task: req.task._id })
    .sort({ createdAt: 1 })
    .populate("author", "name email avatarUrl");

  res.status(200).json({ success: true, count: comments.length, comments });
});

// @route   PATCH /api/comments/:id
// @access  Private (author or admin+) — req.comment set by requireCommentAccess
const updateComment = asyncHandler(async (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ message: "Comment text is required" });
  }

  req.comment.text = text;
  req.comment.edited = true;
  await req.comment.save();

  res.status(200).json({ success: true, comment: req.comment });
});

// @route   DELETE /api/comments/:id
// @access  Private (author or admin+)
const deleteComment = asyncHandler(async (req, res) => {
  await req.comment.deleteOne();
  res.status(200).json({ success: true, message: "Comment deleted" });
});

module.exports = { addComment, getTaskComments, updateComment, deleteComment };
