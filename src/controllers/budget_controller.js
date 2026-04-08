const { category, transaction_types, Budget } = require("../models");

const renderBudgetScreen = async (req, res) => {
  const userId = req.user;
  const budgets = await Budget.findAll({
    attributes: {
      exclude: ["createdAt", "updatedAt", "categoryId"],
    },
    where: {
      userId: userId,
    },
    include: {
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      model: category,
      include: {
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
        model: transaction_types,
      },
    },
  });
  // res.json({ budgets });
  return res.render("dashboard/budget_screen", { budgets });
};

const renderCreateBudgetScreen = async (req, res) => {
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
  return res.render("budget/create_budget", { categories, budget: null });
};

const renderEditBudgetScreen = async (req, res) => {
  const { id } = req.params;

  const categories = await category.findAll({
    where: {
      userId: req.user,
      typeId: 2,
    },
    include: [{ model: transaction_types }],
  });

  const budgetData = await Budget.findOne({
    where: {
      id,
      userId: req.user,
    },
  });

  if (!budgetData) {
    req.flash("error", "budget not found");
    return res.redirect("/budget");
  }

  return res.render("budget/create_budget", {
    categories,
    budget: budgetData,
  });
};

const createBudget = async (req, res) => {
  let { budgetName, amount, categoryId, budgetType, startDate, endDate } =
    req.body;

  console.log(req.body);

  if (budgetType === "range") {
    if (!startDate || !endDate) {
      req.flash("error", "Start and End date are required when type is range");
      return res.redirect("/budget/create_budget");
    }

    startDate = new Date(startDate);
    endDate = new Date(endDate);

    if (isNaN(startDate) || isNaN(endDate)) {
      req.flash("error", "Invalid date format");
      return res.redirect("/budget/create_budget");
    }
  } else {
    startDate = null;
    endDate = null;
  }

  await Budget.create({
    userId: req.user,
    budgetName,
    amount,
    categoryId,
    budgetType,
    startDate,
    endDate,
  });

  req.flash("success", "Budget added successfully");
  return res.redirect("/budget");
};

const editBudget = async (req, res) => {
  const { id } = req.params;
  let { budgetName, amount, categoryId, budgetType, startDate, endDate } =
    req.body;

  const userId = req.user;

  const budget = await Budget.findByPk(id);

  if (!budget) {
    req.flash("error", "Budget not found");
    return res.redirect("/budget");
  }

  if (budget.userId != userId) {
    req.flash("error", "Not authorized");
    return res.redirect("/budget");
  }

  if (budgetType === "range") {
    if (!startDate || !endDate) {
      req.flash("error", "Start and End date are required");
      return res.redirect("back");
    }

    startDate = new Date(startDate);
    endDate = new Date(endDate);

    if (isNaN(startDate) || isNaN(endDate)) {
      req.flash("error", "Invalid date format");
      return res.redirect("back");
    }
  } else {
    startDate = null;
    endDate = null;
  }

  await budget.update({
    budgetName,
    amount,
    categoryId,
    budgetType,
    startDate,
    endDate,
  });

  req.flash("success", "Budget updated successfully");
  return res.redirect("/budget");
};

const destoryBudget = async (req, res) => {
  const { id } = req.params;
  const userId = req.user;

  const budget = await Budget.findByPk(id);

  if (!budget) {
    req.flash("error", "Budget not found");
    return res.redirect("/budget");
  }

  if (budget.userId != userId) {
    req.flash("error", "Not authorized");
    return res.redirect("/budget");
  }

  await budget.destroy();

  req.flash("success", "Budget deleted successfully");
  return res.redirect("/budget");
};

module.exports = {
  renderBudgetScreen,
  renderCreateBudgetScreen,
  createBudget,
  editBudget,
  destoryBudget,
  renderEditBudgetScreen,
};
