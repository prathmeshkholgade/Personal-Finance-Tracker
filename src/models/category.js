"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      category.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });

      category.belongsTo(models.transaction_types, {
        foreignKey: "typeId",
        as: "type",
      });
    }
  }
  category.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },

      categoryName: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: "category",
    },
  );
  return category;
};
