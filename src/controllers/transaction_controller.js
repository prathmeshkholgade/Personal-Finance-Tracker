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
  return res.render("dashboard/create_transaction", {
    categories,
    transaction: null,
  });
};

module.exports.renderTransactionEditScreen = async (req, res) => {
  const id = req.user;
  const txnId = req.params.id;

  const categories = await category.findAll({
    attributes: ["id", "categoryName", "color", "userId"],
    where: { userId: id },
    include: [
      {
        attributes: ["id", "name"],
        model: transaction_types,
      },
    ],
  });

  const transactionData = await Transaction.findByPk(txnId);

  return res.render("dashboard/create_transaction", {
    categories,
    transaction: transactionData,
  });
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

module.exports.editTransaction = async (req, res) => {
  const { id } = req.params;
  const { categoryId, amount, date, note } = req.body;
  const userId = req.user;

  const transaction = await Transaction.findByPk(id);

  if (!transaction) {
    req.flash("error", "Transaction not found");
    return res.redirect("/transaction");
  }

  if (transaction.userId != userId) {
    req.flash("error", "Not authorized");
    return res.redirect("/transaction");
  }

  await transaction.update({
    categoryId,
    amount,
    note,
    date,
  });

  req.flash("success", "Transaction updated successfully");
  return res.redirect("/transaction");
};

module.exports.deleteTransaction = async (req, res) => {
  const { id } = req.params;
  const userId = req.user;

  const transaction = await Transaction.findByPk(id);

  if (!transaction) {
    req.flash("error", "Transaction not found");
    return res.redirect("/transaction");
  }

  if (transaction.userId != userId) {
    req.flash("error", "Not authorized");
    return res.redirect("/transaction");
  }

  await transaction.destroy();

  req.flash("success", "Transaction deleted successfully");
  return res.redirect("/transaction");
};
