const express = require("express");
const { verifyUser } = require("../middleware/auth_middleware");
const router = express.Router();
const reminderController = require("../controllers/reminder_controller");
router.get("/", verifyUser, reminderController.getReminders);
router.get("/create", verifyUser, reminderController.renderCreateReminder);

router.post("/create", verifyUser, reminderController.createReminder);

router.get("/edit/:id", verifyUser, reminderController.renderEditScreen);
router.put("/edit/:id", verifyUser, reminderController.updateReminder);
router.delete("/delete/:id", verifyUser, reminderController.deleteReminder);

module.exports = router;
