"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class paymentReminder extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      paymentReminder.belongsTo(models.User, {
        foreignKey: "userId",
      });
      paymentReminder.belongsTo(models.category, {
        foreignKey: "categoryId",
      });
      // define association here
    }
  }
  paymentReminder.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      dueDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      frequency: {
        type: DataTypes.ENUM("once", "monthly", "quarterly", "yearly"),
        allowNull: false,
      },
      remindBeforeDays: {
        allowNull: false,
        type: DataTypes.INTEGER,
        defaultValue: 1,
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
      timestamps: true,
      sequelize,
      modelName: "paymentReminder",
    },
  );
  return paymentReminder;
};
