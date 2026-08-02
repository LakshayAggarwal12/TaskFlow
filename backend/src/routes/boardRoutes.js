const express = require("express");
const { getBoard, updateBoard, deleteBoard } = require("../controllers/boardController");
const { protect } = require("../middleware/authMiddleware");
const { requireBoardAccess, requireBoardRole } = require("../middleware/boardMiddleware");
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
