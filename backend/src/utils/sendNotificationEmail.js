const User = require("../models/User");
const { sendEmail } = require("../config/mailer");
const { shouldEmail } = require("./notificationPrefs");
const { buildNotificationEmail } = require("./emailTemplates");
const { resolveNotificationLink } = require("./notificationLink");
const logger = require("../config/logger");

// Decides whether a just-created notification should also go out by email,
// and sends it. Returns a status string instead of throwing so callers (and
// tests) can see what happened; real delivery errors are logged, not raised —
// a mail outage must never affect the action that triggered the notification.
const sendNotificationEmail = async ({ userId, type, message, relatedTask = null, relatedProject = null }) => {
  try {
    const user = await User.findById(userId).select("name email notificationPreferences");
    if (!user?.email) return "no_recipient";

    if (!shouldEmail(user.notificationPreferences, type)) return "disabled_by_preference";

    const link = await resolveNotificationLink({ relatedTask, relatedProject });
    const { subject, text, html } = buildNotificationEmail({
      type,
      message,
      link,
      recipientName: user.name,
    });

    const result = await sendEmail({ to: user.email, subject, text, html });
    return result.sent ? "sent" : "skipped_not_configured";
  } catch (error) {
    logger.error("Notification email failed", { type, userId: String(userId), message: error.message });
    return "failed";
  }
};

module.exports = sendNotificationEmail;