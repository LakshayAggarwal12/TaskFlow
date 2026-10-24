export const PRIORITIES = ["low", "medium", "high"];

export const PRIORITY_LABELS = { low: "Low", medium: "Medium", high: "High" };

export const NOTIFICATION_TYPES = [
  "task_assigned",
  "comment_added",
  "due_soon",
  "overdue",
  "sprint_closed",
  "submission_created",
  "submission_approved",
  "submission_changes_requested",
];

// Shown in Account → Notification preferences. Keep in sync with
// backend/src/utils/notificationPrefs.js (a backend test enforces the type list).
export const NOTIFICATION_TYPE_LABELS = {
  task_assigned: { label: "Assigned to you", description: "Someone assigns you a task" },
  comment_added: { label: "New comments", description: "Someone comments on a task you're on" },
  due_soon: { label: "Due soon", description: "A task of yours is due within 24 hours" },
  overdue: { label: "Overdue", description: "A task of yours is past its due date" },
  sprint_closed: { label: "Sprint closed", description: "A sprint you have tasks in is closed" },
  submission_created: { label: "Submitted for review", description: "A task you're on is submitted for review" },
  submission_approved: { label: "Submission approved", description: "Your submission is approved" },
  submission_changes_requested: { label: "Changes requested", description: "A reviewer asks for changes on your submission" },
};