// Pure helpers for per-user notification preferences. Kept free of any
// DB/mailer imports so the rules can be unit tested on their own.

// Every notification type the app can produce — must match the enum in
// models/Notification.js (a test enforces this, so adding a new type there
// without deciding its email default here fails loudly instead of silently
// never emailing).
const NOTIFICATION_TYPES = [
  "task_assigned",
  "comment_added",
  "due_soon",
  "overdue",
  "sprint_closed",
  "submission_created",
  "submission_approved",
  "submission_changes_requested",
];

// Defaults applied to anyone who hasn't customized a type. Comments are off
// by default because they're the noisiest event; everything that needs the
// user to act or know something time-sensitive is on.
const DEFAULT_EMAIL_PREFS = {
  task_assigned: true,
  comment_added: false,
  due_soon: true,
  overdue: true,
  sprint_closed: true,
  submission_created: true,
  submission_approved: true,
  submission_changes_requested: true,
};

// Stored prefs only contain what the user explicitly changed — anything
// missing falls back to the default at read time. That way changing a
// default later applies to everyone who never touched that toggle.
const resolvePreferences = (stored) => {
  const email = { ...DEFAULT_EMAIL_PREFS };
  const storedEmail = stored?.email || {};
  for (const type of NOTIFICATION_TYPES) {
    if (typeof storedEmail[type] === "boolean") email[type] = storedEmail[type];
  }
  return {
    emailEnabled: typeof stored?.emailEnabled === "boolean" ? stored.emailEnabled : true,
    email,
  };
};

const shouldEmail = (stored, type) => {
  const prefs = resolvePreferences(stored);
  return prefs.emailEnabled && prefs.email[type] === true;
};

// Validates an incoming PATCH body. Only known keys with boolean values are
// accepted; anything else is rejected rather than silently dropped, so a typo
// in a type name surfaces as a 400 instead of a toggle that "doesn't save".
const sanitizePreferenceUpdate = (input) => {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return { ok: false, error: "Request body must be an object" };
  }

  const update = {};
  const allowedTop = ["emailEnabled", "email"];
  for (const key of Object.keys(input)) {
    if (!allowedTop.includes(key)) return { ok: false, error: `Unknown preference '${key}'` };
  }

  if ("emailEnabled" in input) {
    if (typeof input.emailEnabled !== "boolean") {
      return { ok: false, error: "emailEnabled must be true or false" };
    }
    update.emailEnabled = input.emailEnabled;
  }

  if ("email" in input) {
    if (!input.email || typeof input.email !== "object" || Array.isArray(input.email)) {
      return { ok: false, error: "email must be an object" };
    }
    update.email = {};
    for (const [type, value] of Object.entries(input.email)) {
      if (!NOTIFICATION_TYPES.includes(type)) return { ok: false, error: `Unknown notification type '${type}'` };
      if (typeof value !== "boolean") return { ok: false, error: `'${type}' must be true or false` };
      update.email[type] = value;
    }
  }

  if (Object.keys(update).length === 0) return { ok: false, error: "No preferences provided" };
  return { ok: true, value: update };
};

// Applies a validated update on top of what's stored, returning a plain
// object ready to assign to the user document.
const mergePreferences = (stored, update) => ({
  emailEnabled: update.emailEnabled ?? stored?.emailEnabled,
  email: { ...(stored?.email || {}), ...(update.email || {}) },
});

module.exports = {
  NOTIFICATION_TYPES,
  DEFAULT_EMAIL_PREFS,
  resolvePreferences,
  shouldEmail,
  sanitizePreferenceUpdate,
  mergePreferences,
};