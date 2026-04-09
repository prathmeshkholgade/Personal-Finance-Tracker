const { Op, fn, col } = require("sequelize");
const {
  Transaction,
  category,
  transaction_types,
  Budget,
} = require("../models");
const reportScreenData = async (userId) => {
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

  return { totalIncome, totalExpense };
};

module.exports = { reportScreenData };
