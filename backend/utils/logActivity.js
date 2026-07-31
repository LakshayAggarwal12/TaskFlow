const Activity = require("../models/Activity");

// Fire-and-forget activity logging. Deliberately does NOT throw — a failed
// log write should never break the actual action the user was performing
// (e.g. creating a task should still succeed even if logging fails).
const logActivity = async ({ project, actor, action, targetType, targetId, message }) => {
  try {
    await Activity.create({ project, actor, action, targetType, targetId, message });
  } catch (error) {
    console.error("Failed to write activity log:", error.message);
  }
};

module.exports = logActivity;
