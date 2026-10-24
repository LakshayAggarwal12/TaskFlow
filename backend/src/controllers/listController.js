const List = require("../models/List");
const Task = require("../models/Task");
const Attachment = require("../models/Attachment");
const TaskSubmission = require("../models/TaskSubmission");
const asyncHandler = require("../utils/asyncHandler");
const logActivity = require("../utils/logActivity");
const { computeOrder, nextOrder } = require("../utils/ordering");
const { emitToBoard } = require("../socket/emit");
const { ROLE_RANK } = require("../middleware/workspaceMiddleware");

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

  logActivity({
    project: req.project._id,
    actor: req.user._id,
    action: "list.created",
    targetType: "List",
    targetId: list._id,
    message: `${req.user.name} created list "${list.name}"`,
  });

  emitToBoard(req.board._id, "list:created", { list });

  res.status(201).json({ success: true, list });
});

// @route   GET /api/boards/:boardId/lists
// @access  Private (board access)
const getBoardLists = asyncHandler(async (req, res) => {
  const lists = await List.find({ board: req.board._id }).sort({ order: 1 });
  res.status(200).json({ success: true, count: lists.length, lists });
});

// @route   PATCH /api/lists/:id
// @access  Private (effective role >= member; changing isDoneList needs admin)
const updateList = asyncHandler(async (req, res) => {
  const { name, isDoneList } = req.body;

  if (isDoneList !== undefined) {
    if (typeof isDoneList !== "boolean") {
      return res.status(400).json({ message: "isDoneList must be true or false" });
    }
    // Which list counts as "Done" decides which moves go through the review
    // gate and what analytics treat as completed. A member who could flip it
    // could just un-flag the Done list, drag a task in, and re-flag it —
    // bypassing the gate — so this one field is an admin-level decision.
    if (ROLE_RANK[req.effectiveRole] < ROLE_RANK.admin) {
      return res.status(403).json({ message: "Only an admin can change which list counts as Done" });
    }
    req.list.isDoneList = isDoneList;
  }

  if (name) req.list.name = name;
  await req.list.save();
  emitToBoard(req.board._id, "list:updated", { list: req.list });
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

  emitToBoard(req.board._id, "list:reordered", { list: req.list });

  res.status(200).json({ success: true, list: req.list });
});

// @route   DELETE /api/lists/:id
// @access  Private (effective role >= admin)
const deleteList = asyncHandler(async (req, res) => {
  const listId = req.list._id.toString();

  const tasks = await Task.find({ list: req.list._id }).select("_id");
  const taskIds = tasks.map((t) => t._id);

  // Cascade: clean up submissions and attachments before removing tasks
  await TaskSubmission.deleteMany({ task: { $in: taskIds } });
  await Attachment.deleteMany({ ownerType: "task", ownerId: { $in: taskIds } });

  await Task.deleteMany({ list: req.list._id });
  await req.list.deleteOne();
  emitToBoard(req.board._id, "list:deleted", { listId });
  res.status(200).json({ success: true, message: "List and all its tasks deleted" });
});

module.exports = { createList, getBoardLists, updateList, reorderList, deleteList };