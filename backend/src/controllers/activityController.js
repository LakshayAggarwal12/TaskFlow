const Activity = require("../models/Activity");
const asyncHandler = require("../utils/asyncHandler");

// @route   GET /api/projects/:id/activity?page=1&limit=20
// @access  Private (project access) — req.project set by requireProjectAccess
const getProjectActivity = asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit) || 20, 100);
  const skip = (page - 1) * limit;

  const [activities, total] = await Promise.all([
    Activity.find({ project: req.project._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("actor", "name email avatarUrl"),
    Activity.countDocuments({ project: req.project._id }),
  ]);

  res.status(200).json({
    success: true,
    page,
    totalPages: Math.ceil(total / limit),
    totalCount: total,
    activities,
  });
});

module.exports = { getProjectActivity };
