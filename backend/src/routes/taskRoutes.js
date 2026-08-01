const express = require("express");
const {
  getTask,
  updateTask,
  moveTask,
  toggleSubtask,
  addSubtask,
  deleteTask,
} = require("../src/controllers/taskController");
const { protect } = require("../src/middleware/authMiddleware");
const { requireTaskAccess, requireTaskRole } = require("../src/middleware/taskMiddleware");
const taskCommentRoutes = require("./taskCommentRoutes");

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

// Nested: /api/tasks/:taskId/comments
router.use("/:id/comments", (req, res, next) => {
  req.params.taskId = req.params.id; // let mergeParams-based nested router see it as taskId
  next();
}, taskCommentRoutes);

module.exports = router;
