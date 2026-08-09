const Comment = require("../models/Comment");
const Task = require("../models/Task");
const asyncHandler = require("../utils/asyncHandler");
const logActivity = require("../utils/logActivity");
const { notifyMany } = require("../utils/createNotification");

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

  // Notify task assignees about the new comment (skip the comment author)
  const task = await Task.findById(req.task._id).select("assignees");
  if (task && task.assignees.length > 0) {
    const toNotify = task.assignees
      .map((id) => id.toString())
      .filter((id) => id !== req.user._id.toString());
    notifyMany(toNotify, {
      type: "comment_added",
      message: `${req.user.name} commented on "${req.task.title}"`,
      relatedTask: req.task._id,
      relatedProject: req.project._id,
    });
  }

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
