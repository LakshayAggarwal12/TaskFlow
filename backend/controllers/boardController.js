const Board = require("../models/Board");
const List = require("../models/List");
const Task = require("../models/Task");
const asyncHandler = require("../utils/asyncHandler");
const logActivity = require("../utils/logActivity");

// @route   POST /api/projects/:projectId/boards
// @access  Private (effective role >= member)
const createBoard = asyncHandler(async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: "Board name is required" });
  }

  const board = await Board.create({
    project: req.project._id,
    name,
    createdBy: req.user._id,
  });

  logActivity({
    project: req.project._id,
    actor: req.user._id,
    action: "board.created",
    targetType: "Board",
    targetId: board._id,
    message: `${req.user.name} created board "${board.name}"`,
  });

  res.status(201).json({ success: true, board });
});

// @route   GET /api/projects/:projectId/boards
// @access  Private (project access)
const getProjectBoards = asyncHandler(async (req, res) => {
  const boards = await Board.find({ project: req.project._id }).sort({ createdAt: 1 });
  res.status(200).json({ success: true, count: boards.length, boards });
});

// @route   GET /api/boards/:id
// @access  Private (board access)
// Returns the board with its lists and each list's tasks, all pre-sorted by order
const getBoard = asyncHandler(async (req, res) => {
  const lists = await List.find({ board: req.board._id }).sort({ order: 1 }).lean();

  const listIds = lists.map((l) => l._id);
  const tasks = await Task.find({ list: { $in: listIds } })
    .sort({ order: 1 })
    .populate("assignees", "name email avatarUrl")
    .lean();

  const tasksByList = listIds.reduce((acc, id) => {
    acc[id.toString()] = [];
    return acc;
  }, {});
  tasks.forEach((t) => tasksByList[t.list.toString()].push(t));

  const listsWithTasks = lists.map((l) => ({ ...l, tasks: tasksByList[l._id.toString()] }));

  res.status(200).json({ success: true, board: req.board, lists: listsWithTasks });
});

// @route   PATCH /api/boards/:id
// @access  Private (effective role >= admin)
const updateBoard = asyncHandler(async (req, res) => {
  const { name } = req.body;
  if (name) req.board.name = name;
  await req.board.save();
  res.status(200).json({ success: true, board: req.board });
});

// @route   DELETE /api/boards/:id
// @access  Private (effective role >= admin)
const deleteBoard = asyncHandler(async (req, res) => {
  const lists = await List.find({ board: req.board._id }).select("_id");
  const listIds = lists.map((l) => l._id);

  await Task.deleteMany({ list: { $in: listIds } });
  await List.deleteMany({ board: req.board._id });
  await req.board.deleteOne();

  res.status(200).json({ success: true, message: "Board and all its lists/tasks deleted" });
});

module.exports = { createBoard, getProjectBoards, getBoard, updateBoard, deleteBoard };
