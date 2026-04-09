const { PaymentReminder, category } = require("../models");

module.exports.createReminder = async (req, res) => {
  const {
    title,
    dueDate,
    frequency,
    notificationMethod,
    remindBeforeDays,
    categoryId,
  } = req.body;

  const reminder = await PaymentReminder.create({
    title,
    dueDate,
    frequency,
    notificationMethod,
    remindBeforeDays,
    categoryId,
    userId: req.user,
  });

  res.json({ success: true, reminder });
};

module.exports.getReminders = async (req, res) => {
  const reminders = await PaymentReminder.findAll({
    where: { userId: req.user },
    include: [
      {
        model: category,
        attributes: ["categoryName"],
      },
    ],
    order: [["dueDate", "ASC"]],
  });

  res.json({ reminders });
};

module.exports.updateReminder = async (req, res) => {
  const { id } = req.params;

  await PaymentReminder.update(req.body, {
    where: {
      id,
      userId: req.user,
    },
  });

  res.json({ success: true, message: "Updated successfully" });
};

module.exports.deleteReminder = async (req, res) => {
  const { id } = req.params;

  await PaymentReminder.destroy({
    where: {
      id,
      userId: req.user,
    },
  });

  res.json({ success: true, message: "Deleted successfully" });
};
