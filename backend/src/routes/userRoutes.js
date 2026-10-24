const express = require("express");
const {
  getNotificationPreferences,
  updateNotificationPreferences,
  sendTestEmail,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();
router.use(protect);

// Mounted at /api/users
router
  .route("/me/notification-preferences")
  .get(getNotificationPreferences)
  .patch(updateNotificationPreferences);

router.post("/me/notification-preferences/test-email", sendTestEmail);

module.exports = router;