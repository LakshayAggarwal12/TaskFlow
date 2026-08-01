const express = require("express");
const { getBoard, updateBoard, deleteBoard } = require("../src/controllers/boardController");
const { protect } = require("../src/middleware/authMiddleware");
const { requireBoardAccess, requireBoardRole } = require("../src/middleware/boardMiddleware");
const boardListRoutes = require("./boardListRoutes");

const router = express.Router();
router.use(protect);

// Mounted at /api/boards
router.route("/:id")
  .get(requireBoardAccess, getBoard)
  .patch(requireBoardAccess, requireBoardRole("admin"), updateBoard)
  .delete(requireBoardAccess, requireBoardRole("admin"), deleteBoard);

// Nested: /api/boards/:boardId/lists
router.use("/:boardId/lists", boardListRoutes);

module.exports = router;
