const express = require("express");
const {
  getSprint,
  updateSprint,
  addTaskToSprint,
  removeTaskFromSprint,
  closeSprint,
  deleteSprint,
} = require("../controllers/sprintController");
const { protect } = require("../middleware/authMiddleware");
const { requireSprintAccess, requireSprintRole } = require("../middleware/sprintMiddleware");

const router = express.Router();
router.use(protect);

// Mounted at /api/sprints
router.route("/:id")
  .get(requireSprintAccess, getSprint)
  .patch(requireSprintAccess, requireSprintRole("admin"), updateSprint)
  .delete(requireSprintAccess, requireSprintRole("admin"), deleteSprint);

router.route("/:id/tasks")
  .post(requireSprintAccess, requireSprintRole("member"), addTaskToSprint);

router.route("/:id/tasks/:taskId")
  .delete(requireSprintAccess, requireSprintRole("member"), removeTaskFromSprint);

router.route("/:id/close")
  .post(requireSprintAccess, requireSprintRole("admin"), closeSprint);

module.exports = router;
