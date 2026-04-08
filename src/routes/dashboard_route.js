const express = require("express");
const {
  renderDashboardScreen,
} = require("../controllers/dashboard_controller");
const { verifyUser } = require("../middleware/auth_middleware");
const router = express.Router();

router.get("/", verifyUser, renderDashboardScreen);

module.exports = router;
