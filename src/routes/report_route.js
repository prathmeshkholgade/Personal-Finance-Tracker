const express = require("express");
const router = express.Router();
const { Op, fn, col } = require("sequelize");
const {
  Transaction,
  category,
  transaction_types,
  Budget,
} = require("../models");
const { verifyUser } = require("../middleware/auth_middleware");
const { where } = require("sequelize");
const { date } = require("joi");
const {
  generatePdf,
  renderReportScreen,
} = require("../controllers/report_controller");
router.get("/", verifyUser, renderReportScreen);

router.get("/generate-report", verifyUser, generatePdf);

module.exports = router;
