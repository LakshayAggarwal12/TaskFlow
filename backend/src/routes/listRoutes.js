const express = require("express");
const { updateList, reorderList, deleteList } = require("../controllers/listController");
const { protect } = require("../middleware/authMiddleware");
const { requireListAccess, requireListRole } = require("../middleware/listMiddleware");
const listTaskRoutes = require("./listTaskRoutes");

const router = express.Router();
router.use(protect);

// Mounted at /api/lists
router.route("/:id")
  .patch(requireListAccess, requireListRole("member"), updateList)
  .delete(requireListAccess, requireListRole("admin"), deleteList);

router.route("/:id/reorder")
  .patch(requireListAccess, requireListRole("member"), reorderList);

// Nested: /api/lists/:listId/tasks
router.use("/:listId/tasks", listTaskRoutes);

module.exports = router;
