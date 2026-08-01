const List = require("../models/List");
const Board = require("../models/Board");
const resolveProjectRole = require("../utils/resolveProjectRole");
const { ROLE_RANK } = require("./workspaceMiddleware");

// Loads the list from :listId (or :id), then its board, then resolves the
// user's effective role via the board's parent project.
// Attaches req.list, req.board, req.project, req.workspace, req.effectiveRole.
const requireListAccess = async (req, res, next) => {
  try {
    const listId = req.params.listId || req.params.id;
    const list = await List.findById(listId);
    if (!list) {
      return res.status(404).json({ message: "List not found" });
    }

    const board = await Board.findById(list.board);
    if (!board) {
      return res.status(404).json({ message: "Parent board not found" });
    }

    const { project, workspace, effectiveRole } = await resolveProjectRole(board.project, req.user._id);

    req.list = list;
    req.board = board;
    req.project = project;
    req.workspace = workspace;
    req.effectiveRole = effectiveRole;
    next();
  } catch (error) {
    return res.status(error.status || 400).json({ message: error.message || "Invalid list id" });
  }
};

const requireListRole = (minRole) => {
  return (req, res, next) => {
    if (ROLE_RANK[req.effectiveRole] < ROLE_RANK[minRole]) {
      return res.status(403).json({
        message: `This action requires '${minRole}' role or higher on this list's project`,
      });
    }
    next();
  };
};

module.exports = { requireListAccess, requireListRole };
