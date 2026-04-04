const express = require("express");
const { category, transaction_types, Budget } = require("../models");
const { renderBudgetScreen } = require("../controllers/budget_controller");
const { verifyUser } = require("../middleware/auth_middleware");
const budget = require("../models/budget");
const router = express.Router();

router.get("/", renderBudgetScreen);

router.get("/create", verifyUser, async (req, res) => {
  const categories = await category.findAll({
    where: {
      userId: req.user,
      typeId: 2,
    },
    include: [
      {
        model: transaction_types,
      },
    ],
  });
  return res.render("budget/create_budget", { categories });
});

router.post("/create", verifyUser, async (req, res) => {
  const { budgetName, amount, categoryId, budgetType, startDate, endDate } =
    req.body;

  if (budgetType === "range" && (!startDate || !endDate)) {
    req.flash("error", "Start and End date are required when type is range");
    return res.redirect("/budget/create_budget");
  }

  const budget = await Budget.create({
    userId: req.user,
    budgetName: budgetName,
    amount,
    categoryId,
    budgetType,
    startDate,
    endDate,
  });
  req.flash("success", "budget added successfully");
  return res.redirect("/dashboard/budget_screen");
  // continue logic
});

module.exports = router;
