const express = require("express");
const {
  renderDashboardScreen,
} = require("../controllers/dashboard_controller");
const { verifyUser } = require("../middleware/auth_middleware");
const wrapAsync = require("../utils/wrap_async");
const router = express.Router();

router.get("/", verifyUser, wrapAsync(renderDashboardScreen));

module.exports = router;
