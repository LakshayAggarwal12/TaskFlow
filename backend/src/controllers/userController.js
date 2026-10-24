const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const { resolvePreferences, sanitizePreferenceUpdate, mergePreferences } = require("../utils/notificationPrefs");
const { buildTestEmail } = require("../utils/emailTemplates");
const { sendEmail, isMailerConfigured } = require("../config/mailer");

const TEST_EMAIL_COOLDOWN_MS = 30 * 1000;
const lastTestEmailAt = new Map(); // userId -> timestamp; fine for a single instance

const buildResponse = (user) => ({
  success: true,
  preferences: resolvePreferences(user.toObject().notificationPreferences),
  // Lets the UI tell the user when the server simply has no SMTP set up,
  // instead of toggles that look active but can never send.
  emailConfigured: isMailerConfigured(),
});

// @route   GET /api/users/me/notification-preferences
// @access  Private
const getNotificationPreferences = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("notificationPreferences");
  res.status(200).json(buildResponse(user));
});

// @route   PATCH /api/users/me/notification-preferences
// @access  Private
// Body: { emailEnabled?: boolean, email?: { [type]: boolean } }
const updateNotificationPreferences = asyncHandler(async (req, res) => {
  const result = sanitizePreferenceUpdate(req.body);
  if (!result.ok) {
    return res.status(400).json({ message: result.error });
  }

  const user = await User.findById(req.user._id).select("notificationPreferences");
  user.notificationPreferences = mergePreferences(user.toObject().notificationPreferences, result.value);
  await user.save();

  res.status(200).json(buildResponse(user));
});

// @route   POST /api/users/me/notification-preferences/test-email
// @access  Private — sends a test message to the signed-in user's own address only
const sendTestEmail = asyncHandler(async (req, res) => {
  if (!isMailerConfigured()) {
    return res.status(503).json({
      message: "Email isn't configured on the server yet. Set the SMTP_* and EMAIL_FROM variables in backend/.env.",
    });
  }

  const key = String(req.user._id);
  const last = lastTestEmailAt.get(key) || 0;
  if (Date.now() - last < TEST_EMAIL_COOLDOWN_MS) {
    return res.status(429).json({ message: "Please wait a few seconds before sending another test email." });
  }
  lastTestEmailAt.set(key, Date.now());

  try {
    const { subject, text, html } = buildTestEmail({ recipientName: req.user.name });
    await sendEmail({ to: req.user.email, subject, text, html });
  } catch (error) {
    // Unlike notification emails, here the user explicitly asked — so show them why it failed.
    lastTestEmailAt.delete(key);
    return res.status(502).json({ message: `Couldn't send the test email: ${error.message}` });
  }

  res.status(200).json({ success: true, message: `Test email sent to ${req.user.email}` });
});

module.exports = { getNotificationPreferences, updateNotificationPreferences, sendTestEmail };