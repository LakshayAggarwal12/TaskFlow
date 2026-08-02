const express = require("express");
const { createTask, getListTasks } = require("../controllers/taskController");
const { protect } = require("../middleware/authMiddleware");
const { requireListAccess, requireListRole } = require("../middleware/listMiddleware");

const router = express.Router({ mergeParams: true });
router.use(protect);

// Mounted at /api/lists/:listId/tasks
router.route("/")
  .post(requireListAccess, requireListRole("member"), createTask)
  .get(requireListAccess, getListTasks);

module.exports = router;
