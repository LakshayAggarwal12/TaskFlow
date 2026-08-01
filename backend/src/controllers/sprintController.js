const Sprint = require("../models/Sprint");
const Task = require("../models/Task");
const List = require("../models/List");
const Board = require("../models/Board");
const asyncHandler = require("../utils/asyncHandler");
const logActivity = require("../utils/logActivity");

// @route   POST /api/projects/:projectId/sprints
// @access  Private (effective role >= member)
const createSprint = asyncHandler(async (req, res) => {
  const { name, goal, startDate, endDate } = req.body;

  if (!name || !startDate || !endDate) {
    return res.status(400).json({ message: "name, startDate, and endDate are required" });
  }

  const sprint = await Sprint.create({
    project: req.project._id,
    name,
    goal,
    startDate,
    endDate,
    createdBy: req.user._id,
  });

  logActivity({
    project: req.project._id,
    actor: req.user._id,
    action: "sprint.created",
    targetType: "Sprint",
    targetId: sprint._id,
    message: `${req.user.name} created sprint "${sprint.name}"`,
  });

  res.status(201).json({ success: true, sprint });
});

// @route   GET /api/projects/:projectId/sprints
// @access  Private (project access)
const getProjectSprints = asyncHandler(async (req, res) => {
  const sprints = await Sprint.find({ project: req.project._id }).sort({ startDate: -1 });
  res.status(200).json({ success: true, count: sprints.length, sprints });
});

// @route   GET /api/sprints/:id
// @access  Private (sprint access)
// Returns the sprint plus its tasks and a live burndown-style snapshot
const getSprint = asyncHandler(async (req, res) => {
  const tasks = await Task.find({ sprint: req.sprint._id }).populate("assignees", "name email avatarUrl");

  // Figure out which of this sprint's tasks sit in a "done" list
  const listIds = [...new Set(tasks.map((t) => t.list.toString()))];
  const lists = await List.find({ _id: { $in: listIds } }).select("_id isDoneList");
  const doneListIds = new Set(lists.filter((l) => l.isDoneList).map((l) => l._id.toString()));

  const totalEstimatedHours = tasks.reduce((sum, t) => sum + (t.estimatedHours || 0), 0);
  const completedTasks = tasks.filter((t) => doneListIds.has(t.list.toString()));
  const completedEstimatedHours = completedTasks.reduce((sum, t) => sum + (t.estimatedHours || 0), 0);

  const today = new Date();
  const totalDays = Math.max(1, Math.ceil((req.sprint.endDate - req.sprint.startDate) / (1000 * 60 * 60 * 24)));
  const daysElapsed = Math.min(
    totalDays,
    Math.max(0, Math.ceil((today - req.sprint.startDate) / (1000 * 60 * 60 * 24)))
  );

  res.status(200).json({
    success: true,
    sprint: req.sprint,
    tasks,
    snapshot: {
      totalTasks: tasks.length,
      completedTasks: completedTasks.length,
      totalEstimatedHours,
      completedEstimatedHours,
      remainingEstimatedHours: totalEstimatedHours - completedEstimatedHours,
      totalDays,
      daysElapsed,
      daysRemaining: Math.max(0, totalDays - daysElapsed),
      // Ideal remaining hours if work burned down linearly — useful as the
      // "target line" on a burndown chart, plotted against remainingEstimatedHours
      idealRemainingHours: Math.max(0, totalEstimatedHours * (1 - daysElapsed / totalDays)),
    },
  });
});

// @route   PATCH /api/sprints/:id
// @access  Private (effective role >= admin)
const updateSprint = asyncHandler(async (req, res) => {
  const { name, goal, startDate, endDate } = req.body;
  if (name) req.sprint.name = name;
  if (goal !== undefined) req.sprint.goal = goal;
  if (startDate) req.sprint.startDate = startDate;
  if (endDate) req.sprint.endDate = endDate;

  await req.sprint.save();
  res.status(200).json({ success: true, sprint: req.sprint });
});

// @route   POST /api/sprints/:id/tasks
// @access  Private (effective role >= member)
// Body: { taskId }
const addTaskToSprint = asyncHandler(async (req, res) => {
  const { taskId } = req.body;
  const task = await Task.findById(taskId);
  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  // Confirm the task actually belongs to this sprint's project before attaching it
  const list = await List.findById(task.list);
  const board = await Board.findById(list.board);
  if (board.project.toString() !== req.project._id.toString()) {
    return res.status(400).json({ message: "Task does not belong to this sprint's project" });
  }

  task.sprint = req.sprint._id;
  await task.save();

  res.status(200).json({ success: true, task });
});

// @route   DELETE /api/sprints/:id/tasks/:taskId
// @access  Private (effective role >= member)
const removeTaskFromSprint = asyncHandler(async (req, res) => {
  const task = await Task.findOne({ _id: req.params.taskId, sprint: req.sprint._id });
  if (!task) {
    return res.status(404).json({ message: "Task not found in this sprint" });
  }

  task.sprint = null;
  await task.save();

  res.status(200).json({ success: true, task });
});

// @route   POST /api/sprints/:id/close
// @access  Private (effective role >= admin)
const closeSprint = asyncHandler(async (req, res) => {
  req.sprint.status = "completed";
  await req.sprint.save();

  logActivity({
    project: req.project._id,
    actor: req.user._id,
    action: "sprint.closed",
    targetType: "Sprint",
    targetId: req.sprint._id,
    message: `${req.user.name} closed sprint "${req.sprint.name}"`,
  });

  // AI-generated summary hooks in here in Phase 5 (see Sprint.aiSummary field)
  res.status(200).json({ success: true, sprint: req.sprint });
});

// @route   DELETE /api/sprints/:id
// @access  Private (effective role >= admin)
const deleteSprint = asyncHandler(async (req, res) => {
  await Task.updateMany({ sprint: req.sprint._id }, { $set: { sprint: null } });
  await req.sprint.deleteOne();
  res.status(200).json({ success: true, message: "Sprint deleted; its tasks were unassigned from it" });
});

module.exports = {
  createSprint,
  getProjectSprints,
  getSprint,
  updateSprint,
  addTaskToSprint,
  removeTaskFromSprint,
  closeSprint,
  deleteSprint,
};
