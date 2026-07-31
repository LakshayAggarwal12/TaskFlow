const express = require("express");
const {
  getTask,
  updateTask,
  moveTask,
  toggleSubtask,
  addSubtask,
  deleteTask,
} = require("../controllers/taskController");
const { protect } = require("../middleware/authMiddleware");
const { requireTaskAccess, requireTaskRole } = require("../middleware/taskMiddleware");

const router = express.Router();
router.use(protect);

// Mounted at /api/tasks
router.route("/:id")
  .get(requireTaskAccess, getTask)
  .patch(requireTaskAccess, requireTaskRole("member"), updateTask)
  .delete(requireTaskAccess, requireTaskRole("admin"), deleteTask);

router.route("/:id/move")
  .patch(requireTaskAccess, requireTaskRole("member"), moveTask);

router.route("/:id/subtasks")
  .post(requireTaskAccess, requireTaskRole("member"), addSubtask);

router.route("/:id/subtasks/:subtaskId")
  .patch(requireTaskAccess, requireTaskRole("member"), toggleSubtask);

module.exports = router;
