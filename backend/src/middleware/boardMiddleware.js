const Board = require("../models/Board");
const resolveProjectRole = require("../utils/resolveProjectRole");
const { ROLE_RANK } = require("./workspaceMiddleware");

// Loads the board from :boardId (or :id), then resolves the user's
// effective role via its parent project. Attaches req.board, req.project,
// req.workspace, req.effectiveRole.
const requireBoardAccess = async (req, res, next) => {
  try {
    const boardId = req.params.boardId || req.params.id;
    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    const { project, workspace, effectiveRole } = await resolveProjectRole(board.project, req.user._id);

    req.board = board;
    req.project = project;
    req.workspace = workspace;
    req.effectiveRole = effectiveRole;
    next();
  } catch (error) {
    return res.status(error.status || 400).json({ message: error.message || "Invalid board id" });
  }
};

const requireBoardRole = (minRole) => {
  return (req, res, next) => {
    if (ROLE_RANK[req.effectiveRole] < ROLE_RANK[minRole]) {
      return res.status(403).json({
        message: `This action requires '${minRole}' role or higher on this board's project`,
      });
    }
    next();
  };
};

module.exports = { requireBoardAccess, requireBoardRole };
