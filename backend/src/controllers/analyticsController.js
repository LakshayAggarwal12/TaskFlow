const Board = require("../models/Board");
const List = require("../models/List");
const Task = require("../models/Task");
const asyncHandler = require("../utils/asyncHandler");

// @route   GET /api/projects/:id/analytics/overview
// @access  Private (project access) — req.project set by requireProjectAccess
const getProjectOverview = asyncHandler(async (req, res) => {
  const boards = await Board.find({ project: req.project._id }).select("_id");
  const boardIds = boards.map((b) => b._id);

  const lists = await List.find({ board: { $in: boardIds } }).select("_id name isDoneList");
  const listIds = lists.map((l) => l._id);
  const listMeta = lists.reduce((acc, l) => {
    acc[l._id.toString()] = { name: l.name, isDoneList: l.isDoneList };
    return acc;
  }, {});

  // Task status distribution — group by list name (via aggregation, joined against List)
  const statusDistribution = await Task.aggregate([
    { $match: { list: { $in: listIds } } },
    { $group: { _id: "$list", count: { $sum: 1 } } },
  ]).then((rows) =>
    rows.map((r) => ({
      listId: r._id,
      listName: listMeta[r._id.toString()]?.name || "Unknown",
      isDoneList: listMeta[r._id.toString()]?.isDoneList || false,
      count: r.count,
    }))
  );

  const totalTasks = statusDistribution.reduce((sum, s) => sum + s.count, 0);
  const completedTasks = statusDistribution.filter((s) => s.isDoneList).reduce((sum, s) => sum + s.count, 0);

  // Workload per member — count of currently-assigned, non-done tasks per user
  const doneListIds = lists.filter((l) => l.isDoneList).map((l) => l._id);
  const nonDoneListIds = listIds.filter((id) => !doneListIds.some((d) => d.equals(id)));

  const workloadByMember = await Task.aggregate([
    { $match: { list: { $in: nonDoneListIds }, assignees: { $exists: true, $ne: [] } } },
    { $unwind: "$assignees" },
    { $group: { _id: "$assignees", taskCount: { $sum: 1 } } },
    { $lookup: { from: "users", localField: "_id", foreignField: "_id", as: "user" } },
    { $unwind: "$user" },
    { $project: { _id: 0, userId: "$user._id", name: "$user.name", avatarUrl: "$user.avatarUrl", taskCount: 1 } },
    { $sort: { taskCount: -1 } },
  ]);

  // Overdue tasks — past due date, not sitting in a done list
  const overdueTasks = await Task.find({
    list: { $in: nonDoneListIds },
    dueDate: { $ne: null, $lt: new Date() },
  })
    .select("title dueDate priority list assignees")
    .populate("assignees", "name avatarUrl")
    .sort({ dueDate: 1 });

  res.status(200).json({
    success: true,
    overview: {
      totalTasks,
      completedTasks,
      completionRate: totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0,
      statusDistribution,
      workloadByMember,
      overdueTasks,
      overdueCount: overdueTasks.length,
    },
  });
});

module.exports = { getProjectOverview };
