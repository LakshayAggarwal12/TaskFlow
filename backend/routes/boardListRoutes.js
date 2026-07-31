const express = require("express");
const { createList, getBoardLists } = require("../controllers/listController");
const { protect } = require("../middleware/authMiddleware");
const { requireBoardAccess, requireBoardRole } = require("../middleware/boardMiddleware");

const router = express.Router({ mergeParams: true });
router.use(protect);

// Mounted at /api/boards/:boardId/lists
router.route("/")
  .post(requireBoardAccess, requireBoardRole("member"), createList)
  .get(requireBoardAccess, getBoardLists);

module.exports = router;
