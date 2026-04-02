const { not } = require("joi");
const { category, transaction_types, Transaction } = require("../models");
module.exports.renderTransactionScreen = async (req, res) => {
  const transactions = await Transaction.findAll({
    where: {
      id: req.body,
    },
  });

  return res.render("dashboard/transaction_screen");
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
  //   res.json({ categories });
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
