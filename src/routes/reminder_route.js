const express = require("express");
const { verifyUser } = require("../middleware/auth_middleware");
const router = express.Router();
const reminderController = require("../controllers/reminder_controller");

router.post("/create", verifyUser, reminderController.createReminder);
router.get("/", verifyUser, reminderController.getReminders);
router.patch("/update/:id", verifyUser, reminderController.updateReminder);
router.delete("/delete/:id", verifyUser, reminderController.deleteReminder);

module.exports = router;
