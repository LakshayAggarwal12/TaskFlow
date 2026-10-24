const Notification = require("../models/Notification");
const { emitToUser } = require("../socket/emit");
const sendNotificationEmail = require("./sendNotificationEmail");
const logger = require("../config/logger");

// Fire-and-forget notification creation. Never throws — a failed
// notification write should never break the action that triggered it
// (e.g. assigning a user to a task should still succeed either way).
const createNotification = async ({ user, type, message, relatedTask = null, relatedProject = null }) => {
  try {
    const notification = await Notification.create({ user, type, message, relatedTask, relatedProject });
    // Live push — the frontend's 60s poll stays as a fallback, this just
    // makes the common case (app open, tab focused) feel instant.
    emitToUser(user, "notification:new", notification);

    // Email, if the user's preferences allow it. Deliberately not awaited —
    // SMTP latency or an outage must never slow down or break the action
    // that created the notification (sendNotificationEmail never throws).
    sendNotificationEmail({ userId: user, type, message, relatedTask, relatedProject });
  } catch (error) {
    logger.error("Failed to create notification", { message: error.message });
  }
};

// Convenience for notifying several users at once (e.g. all assignees except the actor)
const notifyMany = (userIds, payload) => {
  userIds.forEach((user) => createNotification({ ...payload, user }));
};

module.exports = { createNotification, notifyMany };