"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeConstraint("Transaction", "budgets_ibfk_2");

    await queryInterface.addConstraint("Transaction", {
      fields: ["categoryId"],
      type: "foreign key",
      name: "budgets_ibfk_2",
      references: {
        table: "categories",
        field: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint("Budgets", "budgets_ibfk_2");

    await queryInterface.addConstraint("Budgets", {
      fields: ["categoryId"],
      type: "foreign key",
      name: "budgets_ibfk_2",
      references: {
        table: "categories",
        field: "id",
      },
      onDelete: "RESTRICT", // default
      onUpdate: "CASCADE",
    });
  },
};
