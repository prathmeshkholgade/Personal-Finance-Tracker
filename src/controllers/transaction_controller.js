const { not } = require("joi");
const { category, transaction_types, Transaction } = require("../models");
module.exports.renderTransactionScreen = async (req, res) => {
  const id = req.user;
  const transactions = await Transaction.findAll({
    attributes: {
      exclude: ["createdAt", "updatedAt"],
    },
    where: {
      userId: id,
    },
    include: [
      {
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
        model: category,
        include: [
          {
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
            model: transaction_types,
          },
        ],
      },
    ],
  });

  // res.json({ transactions });
  return res.render("dashboard/transaction_screen", { transactions });
};
module.exports.renderTransactionCreateScreen = async (req, res) => {
  const id = req.user;
  const categories = await category.findAll({
    attributes: ["id", "categoryName", "color", "userId"],
    where: {
      userId: id,
    },
    include: [
      {
        attributes: ["id", "name"],
        model: transaction_types,
      },
    ],
  });
  return res.render("dashboard/create_transaction", { categories });
};

module.exports.createTransaction = async (req, res) => {
  const { categoryId, amount, date, note } = req.body;
  const t = await Transaction.create({
    userId: req.user,
    categoryId: categoryId,
    amount: amount,
    note: note,
    date: date,
  });
  req.flash("success", "transaction added");
  return res.redirect("/transaction");
};
