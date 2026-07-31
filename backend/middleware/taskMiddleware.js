const Task = require("../models/Task");
const List = require("../models/List");
const Board = require("../models/Board");
const resolveProjectRole = require("../utils/resolveProjectRole");
const { ROLE_RANK } = require("./workspaceMiddleware");

// Loads the task from :id, walks up list -> board -> project to resolve
// the user's effective role. Attaches req.task, req.list, req.board,
// req.project, req.workspace, req.effectiveRole.
const requireTaskAccess = async (req, res, next) => {
  try {
    const taskId = req.params.taskId || req.params.id;
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const list = await List.findById(task.list);
    if (!list) {
      return res.status(404).json({ message: "Parent list not found" });
    }

    const board = await Board.findById(list.board);
    if (!board) {
      return res.status(404).json({ message: "Parent board not found" });
    }

    const { project, workspace, effectiveRole } = await resolveProjectRole(board.project, req.user._id);

    req.task = task;
    req.list = list;
    req.board = board;
    req.project = project;
    req.workspace = workspace;
    req.effectiveRole = effectiveRole;
    next();
  } catch (error) {
    return res.status(error.status || 400).json({ message: error.message || "Invalid task id" });
  }
};

const requireTaskRole = (minRole) => {
  return (req, res, next) => {
    if (ROLE_RANK[req.effectiveRole] < ROLE_RANK[minRole]) {
      return res.status(403).json({
        message: `This action requires '${minRole}' role or higher on this task's project`,
      });
    }
    next();
  };
};

module.exports = { requireTaskAccess, requireTaskRole };
