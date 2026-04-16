const express = require("express");
const { verifyUser } = require("../middleware/auth_middleware");
const router = express.Router();
const reminderController = require("../controllers/reminder_controller");
const wrapAsync = require("../utils/wrap_async");
router.get("/", verifyUser, wrapAsync(reminderController.getReminders));
router.get("/create", verifyUser, wrapAsync(reminderController.renderCreateReminder));

router.post("/create", verifyUser, wrapAsync(reminderController.createReminder));

router.get("/edit/:id", verifyUser, wrapAsync(reminderController.renderEditScreen));
router.put("/edit/:id", verifyUser, wrapAsync(reminderController.updateReminder));
router.delete("/delete/:id", verifyUser, wrapAsync(reminderController.deleteReminder));

module.exports = router;
