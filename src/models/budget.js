"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Budget extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Budget.belongsTo(models.User);
      Budget.belongsTo(models.category);
      // define association here
    }
  }
  Budget.init(
    {
      budgetName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      amount: {
        type: DataTypes.INTEGER,
      },
      startDate: {
        type: DataTypes.DATE,
      },
      endDate: {
        type: DataTypes.DATE,
      },
      budgetType: {
        allowNull: false,
        type: DataTypes.ENUM(["monthly", "yearly", "range"]),
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Budget",
    },
  );
  return Budget;
};
