const Task = require("../models/Task");
const List = require("../models/List");
const asyncHandler = require("../utils/asyncHandler");
const { computeOrder, nextOrder } = require("../utils/ordering");

// @route   POST /api/lists/:listId/tasks
// @access  Private (effective role >= member)
const createTask = asyncHandler(async (req, res) => {
  const { title, description, priority, labels, dueDate, estimatedHours, assignees } = req.body;

  if (!title) {
    return res.status(400).json({ message: "Task title is required" });
  }

  const lastTask = await Task.findOne({ list: req.list._id }).sort({ order: -1 });
  const order = nextOrder(lastTask ? lastTask.order : null);

  const task = await Task.create({
    list: req.list._id,
    title,
    description,
    priority,
    labels,
    dueDate,
    estimatedHours,
    assignees,
    order,
    createdBy: req.user._id,
  });

  res.status(201).json({ success: true, task });
});

// @route   GET /api/lists/:listId/tasks
// @access  Private (list access)
const getListTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find({ list: req.list._id })
    .sort({ order: 1 })
    .populate("assignees", "name email avatarUrl");

  res.status(200).json({ success: true, count: tasks.length, tasks });
});

// @route   GET /api/tasks/:id
// @access  Private (task access)
const getTask = asyncHandler(async (req, res) => {
  const task = await req.task.populate([
    { path: "assignees", select: "name email avatarUrl" },
    { path: "createdBy", select: "name email avatarUrl" },
  ]);
  res.status(200).json({ success: true, task });
});

// @route   PATCH /api/tasks/:id
// @access  Private (effective role >= member)
// General field updates — does NOT change list or order (use /move for that)
const updateTask = asyncHandler(async (req, res) => {
  const editableFields = [
    "title", "description", "priority", "labels",
    "dueDate", "estimatedHours", "loggedHours", "assignees",
  ];

  editableFields.forEach((field) => {
    if (req.body[field] !== undefined) req.task[field] = req.body[field];
  });

  await req.task.save();
  res.status(200).json({ success: true, task: req.task });
});

// @route   PATCH /api/tasks/:id/move
// @access  Private (effective role >= member)
// Body: { targetListId, beforeTaskId, afterTaskId }
// This is THE drag-and-drop endpoint — moves a task to a (possibly different)
// list and positions it between two neighboring tasks in one atomic update.
const moveTask = asyncHandler(async (req, res) => {
  const { targetListId, beforeTaskId, afterTaskId } = req.body;

  if (!targetListId) {
    return res.status(400).json({ message: "targetListId is required" });
  }

  // Confirm the target list belongs to the same board (can't drag a task into another project's board)
  const targetList = await List.findById(targetListId);
  if (!targetList || targetList.board.toString() !== req.board._id.toString()) {
    return res.status(400).json({ message: "Target list not found on this board" });
  }

  const beforeTask = beforeTaskId ? await Task.findById(beforeTaskId) : null;
  const afterTask = afterTaskId ? await Task.findById(afterTaskId) : null;

  req.task.list = targetListId;
  req.task.order = computeOrder(beforeTask?.order ?? null, afterTask?.order ?? null);
  await req.task.save();

  res.status(200).json({ success: true, task: req.task });
});

// @route   PATCH /api/tasks/:id/subtasks/:subtaskId
// @access  Private (effective role >= member)
// Toggles a subtask's done state — small enough to not need its own model/routes
const toggleSubtask = asyncHandler(async (req, res) => {
  const subtask = req.task.subtasks.id(req.params.subtaskId);
  if (!subtask) {
    return res.status(404).json({ message: "Subtask not found" });
  }
  subtask.done = req.body.done !== undefined ? req.body.done : !subtask.done;
  await req.task.save();
  res.status(200).json({ success: true, task: req.task });
});

// @route   POST /api/tasks/:id/subtasks
// @access  Private (effective role >= member)
const addSubtask = asyncHandler(async (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ message: "Subtask text is required" });
  }
  req.task.subtasks.push({ text, done: false });
  await req.task.save();
  res.status(201).json({ success: true, task: req.task });
});

// @route   DELETE /api/tasks/:id
// @access  Private (effective role >= admin)
const deleteTask = asyncHandler(async (req, res) => {
  await req.task.deleteOne();
  res.status(200).json({ success: true, message: "Task deleted" });
});

module.exports = {
  createTask,
  getListTasks,
  getTask,
  updateTask,
  moveTask,
  toggleSubtask,
  addSubtask,
  deleteTask,
};
