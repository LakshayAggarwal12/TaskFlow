const cron = require("node-cron");
const Task = require("../models/Task");
const List = require("../models/List");
const { notifyMany } = require("../utils/createNotification");

// Scans all tasks and creates due_soon / overdue notifications for their
// assignees. Uses the dueSoonNotified/overdueNotified flags on Task so each
// task is only notified once per due date (flags reset when dueDate changes,
// see taskController.updateTask).
const runDueDateReminders = async () => {
  const now = new Date();
  const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  // Only consider tasks NOT sitting in a "done" list
  const doneLists = await List.find({ isDoneList: true }).select("_id");
  const doneListIds = doneLists.map((l) => l._id);

  // --- Due within the next 24 hours ---
  const dueSoonTasks = await Task.find({
    list: { $nin: doneListIds },
    dueDate: { $ne: null, $gte: now, $lte: in24Hours },
    dueSoonNotified: false,
    assignees: { $exists: true, $ne: [] },
  });

  for (const task of dueSoonTasks) {
    notifyMany(
      task.assignees.map((id) => id.toString()),
      { type: "due_soon", message: `"${task.title}" is due within 24 hours`, relatedTask: task._id }
    );
    task.dueSoonNotified = true;
    await task.save();
  }

  // --- Already overdue ---
  const overdueTasks = await Task.find({
    list: { $nin: doneListIds },
    dueDate: { $ne: null, $lt: now },
    overdueNotified: false,
    assignees: { $exists: true, $ne: [] },
  });

  for (const task of overdueTasks) {
    notifyMany(
      task.assignees.map((id) => id.toString()),
      { type: "overdue", message: `"${task.title}" is now overdue`, relatedTask: task._id }
    );
    task.overdueNotified = true;
    await task.save();
  }

  console.log(
    `[reminder cron] ${dueSoonTasks.length} due-soon, ${overdueTasks.length} overdue notifications sent`
  );
};

// Runs once every hour. Change the schedule string to adjust frequency
// (e.g. "0 9 * * *" for once daily at 9am).
const startReminderCron = () => {
  cron.schedule("0 * * * *", () => {
    runDueDateReminders().catch((err) => console.error("[reminder cron] failed:", err.message));
  });
  console.log("Reminder cron job scheduled (hourly)");
};

module.exports = { startReminderCron, runDueDateReminders };
