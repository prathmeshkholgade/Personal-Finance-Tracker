const { paymentReminder, category, transaction_types } = require("../models");

module.exports.createReminder = async (req, res) => {
  const {
    title,
    dueDate,
    frequency,
    notificationMethod,
    remindBeforeDays,
    categoryId,
  } = req.body;

  await paymentReminder.create({
    title,
    dueDate,
    frequency,
    notificationMethod,
    remindBeforeDays,
    categoryId,
    userId: req.user,
  });
  req.flash("success", "reminder created successfully")
  res.redirect("/reminder");
  // res.json({ success: true, reminder });
};

module.exports.getReminders = async (req, res) => {
  const reminders = await paymentReminder.findAll({
    where: { userId: req.user },
    include: [
      {
        model: category,
        attributes: ["categoryName"],
      },
    ],
    order: [["dueDate", "ASC"]],
  });


  return res.render("reminder/reminder_screen", { reminders });
};

module.exports.updateReminder = async (req, res) => {
  const { id } = req.params;

  await paymentReminder.update(req.body, {
    where: {
      id,
      userId: req.user,
    },
  });

  req.flash("success", "Reminder updated successfully");
  return res.redirect("/reminder");
};

module.exports.deleteReminder = async (req, res) => {
  const { id } = req.params;

  await paymentReminder.destroy({
    where: {
      id,
      userId: req.user,
    },
  });
  req.flash("success", "reminder deleted successfully")

  return res.redirect("/reminder");
};

module.exports.renderCreateReminder = async (req, res) => {
  const categories = await category.findAll({
    where: {
      userId: req.user,
    },
    include: [
      {
        model: transaction_types,
        where: {
          name: "Expense"
        }
      }
    ]
  });

  return res.render("reminder/create_reminder", { categories });
};



module.exports.renderEditScreen = async (req, res) => {
  const { id } = req.params;
  const reminder = await paymentReminder.findOne({
    where: {
      id,
      userId: req.user
    }
  });

  if (!reminder) {
    req.flash("error", "Reminder not found");
    return res.redirect("/reminder");
  }

  const categories = await category.findAll({
    where: {
      userId: req.user,
    },
    include: [
      {
        model: transaction_types,
        where: {
          name: "Expense"
        }
      }
    ]
  });

  return res.render("reminder/create_reminder", { categories, reminder });
};


