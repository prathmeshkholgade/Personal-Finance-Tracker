const { transaction_types, category } = require("../models");

module.exports.renderCategoryCreate = async (req, res) => {
  const types = await transaction_types.findAll({
    attributes: ["id", "name"],
  });
  return res.render("category/create_category", { types, category: null });
};

module.exports.renderCategoryEditScreen = async (req, res) => {
  const { id } = req.params;

  const types = await transaction_types.findAll({
    attributes: ["id", "name"],
  });

  const categoryType = await category.findByPk(id);
  return res.render("category/create_category", {
    types,
    category: categoryType,
  });
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
module.exports.editCategory = async (req, res) => {
  const { id } = req.params;
  const { name, typeId, color } = req.body;
  const userId = req.user;

  const cate = await category.findByPk(id);

  if (!cate) {
    req.flash("error", "Category not found");
    return res.redirect("/category");
  }

  if (cate.userId !== userId) {
    req.flash("error", "Not authorized");
    return res.redirect(req.get("Referer") || "/category");
  }

  await cate.update({
    categoryName: name,
    typeId,
    color,
  });

  req.flash("success", "Category updated successfully");
  return res.redirect("/category");
};

module.exports.destoryCategory = async (req, res) => {
  const { id } = req.params;
  const userId = req.user;

  const cate = await category.findByPk(id);

  if (!cate) {
    req.flash("error", "Category not found");
    return res.redirect("/category");
  }

  if (cate.userId != userId) {
    req.flash("error", "Not authorized");
    return res.redirect("/category");
  }

  await cate.destroy();

  req.flash("success", "Category deleted successfully");
  return res.redirect("/category");
};
