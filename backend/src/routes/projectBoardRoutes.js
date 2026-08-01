const express = require("express");
const { createBoard, getProjectBoards } = require("../src/controllers/boardController");
const { protect } = require("../src/middleware/authMiddleware");
const { requireProjectAccess, requireProjectRole } = require("../src/middleware/projectMiddleware");

const router = express.Router({ mergeParams: true });
router.use(protect);

// Mounted at /api/projects/:projectId/boards
router.route("/")
  .post(requireProjectAccess, requireProjectRole("member"), createBoard)
  .get(requireProjectAccess, getProjectBoards);

module.exports = router;
