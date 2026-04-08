const {
  Transaction,
  category,
  transaction_types,
  Budget,
  sequelize,
} = require("../models");

const { Op } = require("sequelize");

const renderDashboardScreen = async (req, res) => {
  const userId = req.user;


  const totalIncome = await Transaction.sum("amount", {
    where: { userId },
    include: [
      {
        model: category,
        required: true,
        attributes: [],
        include: [
          {
            model: transaction_types,
            attributes: [],
            where: { id: 1 },
            required: true,
          },
        ],
      },
    ],
  });

  // ✅ Total Expense
  const totalExpense = await Transaction.sum("amount", {
    where: { userId },
    include: [
      {
        model: category,
        required: true,
        attributes: [],
        include: [
          {
            model: transaction_types,
            attributes: [],
            where: { id: 2 },
            required: true,
          },
        ],
      },
    ],
  });

  const balance = (totalIncome || 0) - (totalExpense || 0);

  // ✅ Fetch Budgets
  const budgets = await Budget.findAll({
    where: { userId },
    include: [
      {
        model: category,
        attributes: ["id", "categoryName", "color"],
      },
    ],
  });

  const budgetProgress = [];
  const now = new Date();

  for (const budget of budgets) {
    let dateFilter = {};

    if (budget.budgetType === "range" && budget.startDate && budget.endDate) {
      dateFilter = {
        date: {
          [Op.between]: [budget.startDate, budget.endDate],
        },
      };
    } else if (budget.budgetType === "monthly") {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      const endOfMonth = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0,
        23,
        59,
        59,
      );

      dateFilter = {
        date: {
          [Op.between]: [startOfMonth, endOfMonth],
        },
      };
    } else if (budget.budgetType === "yearly") {
      const startOfYear = new Date(now.getFullYear(), 0, 1);

      const endOfYear = new Date(now.getFullYear(), 11, 31, 23, 59, 59);

      dateFilter = {
        date: {
          [Op.between]: [startOfYear, endOfYear],
        },
      };
    }

    const spent = await Transaction.sum("amount", {
      where: {
        userId,
        categoryId: budget.categoryId,
        ...dateFilter,
      },
    });

    const total = budget.amount || 0;
    const spentValue = spent || 0;

    const percentage =
      total > 0 ? Math.min((spentValue / total) * 100, 100) : 0;

    budgetProgress.push({
      budgetId: budget.id,
      category: budget.category.categoryName,
      color: budget.category.color,
      budgetType: budget.budgetType,

      budgetAmount: total,
      spent: spentValue,
      remaining: total - spentValue,
      percentage,
    });
  }

  return res.render("dashboard/home.ejs", {
    totalIncome: totalIncome || 0,
    totalExpense: totalExpense || 0,
    balance,
    budgetProgress,
  });
};

// const renderDashboardScreen = async (req, res) => {
//   const userId = req.user;

//   const totalIncome = await Transaction.sum("amount", {
//     where: { userId },

//     include: [
//       {
//         model: category,
//         required: true,
//         attributes: [],
//         include: [
//           {
//             model: transaction_types,
//             attributes: [],
//             where: { id: 1 },
//             required: true,
//           },
//         ],
//       },
//     ],
//   });

//   const totalExpense = await Transaction.sum("amount", {
//     where: { userId },
//     include: [
//       {
//         model: category,
//         required: true,
//         attributes: [],

//         include: [
//           {
//             model: transaction_types,
//             where: { id: 2 },
//             required: true,
//             attributes: [],
//           },
//         ],
//       },
//     ],
//   });

//   const balance = (totalIncome || 0) - (totalExpense || 0);
// ;

//   return res.render("dashboard/home.ejs", {
//     totalIncome: totalIncome || 0,
//     totalExpense: totalExpense || 0,
//     balance,
//   });
// };

module.exports = { renderDashboardScreen };
