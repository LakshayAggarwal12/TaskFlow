const Notification = require("../models/Notification");

// Fire-and-forget notification creation. Never throws — a failed
// notification write should never break the action that triggered it
// (e.g. assigning a user to a task should still succeed either way).
const createNotification = async ({ user, type, message, relatedTask = null, relatedProject = null }) => {
  try {
    await Notification.create({ user, type, message, relatedTask, relatedProject });
  } catch (error) {
    console.error("Failed to create notification:", error.message);
  }
};

// Convenience for notifying several users at once (e.g. all assignees except the actor)
const notifyMany = (userIds, payload) => {
  userIds.forEach((user) => createNotification({ ...payload, user }));
};

module.exports = { createNotification, notifyMany };
