const { transaction_types, category } = require("../models");

module.exports.renderCategoryCreate = async (req, res) => {
  const types = await transaction_types.findAll({
    attributes: ["id", "name"],
  });
  return res.render("category/create_category", { types });
};

module.exports.renderCategoryScreen = async (req, res) => {
  const id = req.user;
  console.log(`user id ${id}`);
  const categories = await category.findAll({
    where: {
      userId: id,
    },
    include: [
      {
        model: transaction_types,
      },
    ],
  });
  return res.render("dashboard/category_screen", { categories });
};

module.exports.createCategory = async (req, res) => {
  const { name, typeId, color } = req.body;

  const id = req.user;

  await category.create({
    categoryName: name,
    userId: id,
    typeId: typeId,
    color: color,
  });

  req.flash("success", "category added successfully");
  return res.redirect("/category");
};
