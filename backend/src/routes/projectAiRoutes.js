const express = require("express");
const { draftTaskDescription, suggestLabel, naturalLanguageSearch } = require("../controllers/aiController");
const { protect } = require("../middleware/authMiddleware");
const { requireProjectAccess, requireProjectRole } = require("../middleware/projectMiddleware");

const router = express.Router({ mergeParams: true });
router.use(protect);

// Mounted at /api/projects/:projectId/ai
router.post("/draft-task", requireProjectAccess, requireProjectRole("member"), draftTaskDescription);
router.post("/suggest-label", requireProjectAccess, requireProjectRole("member"), suggestLabel);
router.post("/search", requireProjectAccess, requireProjectRole("member"), naturalLanguageSearch);

module.exports = router;
