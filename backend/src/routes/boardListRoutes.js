const express = require("express");
const { createList, getBoardLists } = require("../src/controllers/listController");
const { protect } = require("../src/middleware/authMiddleware");
const { requireBoardAccess, requireBoardRole } = require("../src/middleware/boardMiddleware");

const router = express.Router({ mergeParams: true });
router.use(protect);

// Mounted at /api/boards/:boardId/lists
router.route("/")
  .post(requireBoardAccess, requireBoardRole("member"), createList)
  .get(requireBoardAccess, getBoardLists);

module.exports = router;
