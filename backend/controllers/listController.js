const List = require("../models/List");
const Task = require("../models/Task");
const asyncHandler = require("../utils/asyncHandler");
const { computeOrder, nextOrder } = require("../utils/ordering");

// @route   POST /api/boards/:boardId/lists
// @access  Private (effective role >= member)
const createList = asyncHandler(async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: "List name is required" });
  }

  const lastList = await List.findOne({ board: req.board._id }).sort({ order: -1 });
  const order = nextOrder(lastList ? lastList.order : null);

  const list = await List.create({ board: req.board._id, name, order });

  res.status(201).json({ success: true, list });
});

// @route   GET /api/boards/:boardId/lists
// @access  Private (board access)
const getBoardLists = asyncHandler(async (req, res) => {
  const lists = await List.find({ board: req.board._id }).sort({ order: 1 });
  res.status(200).json({ success: true, count: lists.length, lists });
});

// @route   PATCH /api/lists/:id
// @access  Private (effective role >= member)
const updateList = asyncHandler(async (req, res) => {
  const { name } = req.body;
  if (name) req.list.name = name;
  await req.list.save();
  res.status(200).json({ success: true, list: req.list });
});

// @route   PATCH /api/lists/:id/reorder
// @access  Private (effective role >= member)
// Body: { beforeListId, afterListId } — the two lists it's being dropped between (either can be null)
const reorderList = asyncHandler(async (req, res) => {
  const { beforeListId, afterListId } = req.body;

  const beforeList = beforeListId ? await List.findById(beforeListId) : null;
  const afterList = afterListId ? await List.findById(afterListId) : null;

  req.list.order = computeOrder(beforeList?.order ?? null, afterList?.order ?? null);
  await req.list.save();

  res.status(200).json({ success: true, list: req.list });
});

// @route   DELETE /api/lists/:id
// @access  Private (effective role >= admin)
const deleteList = asyncHandler(async (req, res) => {
  await Task.deleteMany({ list: req.list._id });
  await req.list.deleteOne();
  res.status(200).json({ success: true, message: "List and all its tasks deleted" });
});

module.exports = { createList, getBoardLists, updateList, reorderList, deleteList };
