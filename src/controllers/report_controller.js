const { Op, fn, col } = require("sequelize");
const {
  Transaction,
  category,
  transaction_types,
  Budget,
} = require("../models");

const ejs = require("ejs");
const pdf = require("html-pdf-node");
const path = require("path");

const reportService = require("../service/report_service");

module.exports.renderReportScreen = async (req, res) => {
  const userId = req.user;

  const data = await reportService.reportScreenData(userId);

  const balance = (data.totalIncome || 0) - (data.totalExpense || 0);
  return res.render("dashboard/reports_screen", {
    totalIncome: data.totalIncome || 0,
    totalExpense: data.totalExpense || 0,
    balance,
  });
};

module.exports.generatePdf = async (req, res) => {
  const { reportType, startDate, endDate } = req.query;
  const userId = req.user;

  const dateFilter = {};
  if (startDate && endDate) {
    dateFilter.createdAt = {
      [Op.between]: [new Date(startDate), new Date(endDate)],
    };
  }

  let result = {};

  const totalIncome = await Transaction.sum("amount", {
    where: {
      userId,
      ...dateFilter,
    },
    include: [
      {
        model: category,
        required: true,
        attributes: [],
        include: [
          {
            model: transaction_types,
            attributes: [],
            where: { name: "income" },
            required: true,
          },
        ],
      },
    ],
  });

  const totalExpense = await Transaction.sum("amount", {
    where: {
      userId,
      ...dateFilter,
    },
    include: [
      {
        model: category,
        required: true,
        attributes: [],
        include: [
          {
            model: transaction_types,
            attributes: [],
            where: { name: "expense" },
            required: true,
          },
        ],
      },
    ],
  });

  if (reportType === "income-expense") {
    const transactionData = await Transaction.findAll({
      where: {
        userId,
        ...dateFilter,
      },
      include: [
        {
          model: category,
          attributes: ["categoryName"],
          include: [
            {
              model: transaction_types,
              attributes: ["name"],
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    result = { transactionData };
  } else if (reportType === "category") {
    const categoryBasedData = await Transaction.findAll({
      attributes: ["categoryId", [fn("SUM", col("amount")), "totalAmount"]],
      where: {
        userId,
        ...dateFilter,
      },
      include: [
        {
          model: category,
          attributes: ["categoryName"],
          include: [
            {
              model: transaction_types,
              attributes: ["name"],
            },
          ],
        },
      ],
      group: ["categoryId", "category.id"],
      raw: true,
    });

    result = { categoryBasedData };
  } else if (reportType === "budget") {
    const budgets = await Budget.findAll({
      where: { userId },
      include: [
        {
          model: category,
          attributes: ["id", "categoryName", "color"],
        },
      ],
    });

    const spentData = await Transaction.findAll({
      attributes: ["categoryId", [fn("SUM", col("amount")), "totalSpent"]],
      where: {
        userId,
        ...dateFilter,
      },
      group: ["categoryId"],
      raw: true,
    });

    const budgetReport = budgets.map((b) => {
      const spentObj = spentData.find((t) => t.categoryId === b.categoryId);

      const spent = spentObj ? Number(spentObj.totalSpent) : 0;
      const budgetAmount = Number(b.amount);

      let status = "within";
      if (spent > budgetAmount) status = "exceeded";
      if (spent === budgetAmount) status = "exact";

      return {
        categoryId: b.categoryId,
        categoryName: b.category.categoryName,
        color: b.category.color,
        budget: budgetAmount,
        spent,
        remaining: budgetAmount - spent,
        status,
      };
    });

    result = { budgetReport };
  }

  const html = await ejs.renderFile(
    path.join(__dirname, "../views/pdf/report_pdf.ejs"),
    {
      result,
      totalIncome,
      totalExpense,
      reportType,
    },
  );
  console.log(totalExpense);
  console.log(totalIncome);


  const file = { content: html };

  const pdfBuffer = await pdf.generatePdf(file, {
    format: "A4",
  });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=report.pdf");

  res.send(pdfBuffer);

  //   return res.render("dashboard/reports_screen", {
  //     totalIncome: totalIncome || 0,
  //     totalExpense: totalExpense || 0,
  //     result,
  //     reportType,
  //     filters: { startDate, endDate },
  //   });
};
