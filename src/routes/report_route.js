const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  return res.render("dashboard/reports_screen");
});


module.exports = router;
