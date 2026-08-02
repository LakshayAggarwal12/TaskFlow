const Notification = require("../models/Notification");
const asyncHandler = require("../utils/asyncHandler");

// @route   GET /api/notifications?unreadOnly=true&page=1&limit=20
// @access  Private
const getMyNotifications = asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit) || 20, 100);
  const filter = { user: req.user._id };
  if (req.query.unreadOnly === "true") filter.read = false;

  const [notifications, total, unreadCount] = await Promise.all([
    Notification.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("relatedTask", "title")
      .populate("relatedProject", "name"),
    Notification.countDocuments(filter),
    Notification.countDocuments({ user: req.user._id, read: false }),
  ]);

  res.status(200).json({
    success: true,
    page,
    totalPages: Math.ceil(total / limit),
    totalCount: total,
    unreadCount,
    notifications,
  });
});

// @route   PATCH /api/notifications/:id/read
// @access  Private
const markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id }, // scoped to the requester — can't mark others' notifications
    { read: true },
    { new: true }
  );

  if (!notification) {
    return res.status(404).json({ message: "Notification not found" });
  }

  res.status(200).json({ success: true, notification });
});

// @route   PATCH /api/notifications/read-all
// @access  Private
const markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany({ user: req.user._id, read: false }, { read: true });
  res.status(200).json({ success: true, message: "All notifications marked as read" });
});

// @route   DELETE /api/notifications/:id
// @access  Private
const deleteNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!notification) {
    return res.status(404).json({ message: "Notification not found" });
  }
  res.status(200).json({ success: true, message: "Notification deleted" });
});

module.exports = { getMyNotifications, markAsRead, markAllAsRead, deleteNotification };
