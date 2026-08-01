const express = require("express");
const { createTask, getListTasks } = require("../src/controllers/taskController");
const { protect } = require("../src/middleware/authMiddleware");
const { requireListAccess, requireListRole } = require("../src/middleware/listMiddleware");

const router = express.Router({ mergeParams: true });
router.use(protect);

// Mounted at /api/lists/:listId/tasks
router.route("/")
  .post(requireListAccess, requireListRole("member"), createTask)
  .get(requireListAccess, getListTasks);

module.exports = router;
