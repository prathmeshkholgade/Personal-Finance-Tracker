"use strict";
const { Model, Op } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Transaction.belongsTo(models.User, {
        foreignKey: "userId",
      });
      Transaction.belongsTo(models.category, {
        foreignKey: "categoryId",
      });
      // define association here
    }
  }
  Transaction.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      amount: DataTypes.DECIMAL,
      note: { type: DataTypes.STRING, allowNull: true },
      date: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Transaction",
    },
  );
  return Transaction;
};
