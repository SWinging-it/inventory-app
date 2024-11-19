const { DataTypes, Model } = require("sequelize");
const sequelize = require("../db");

class Item extends Model {}

Item.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true // Users will search for items by name, so name must be unique
    },
    price: {
      type: DataTypes.DOUBLE(10,2),
      allowNull: false,
      validate: {
        isNumeric: true // Price has to be a number, but allow for decimals
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false
    },
    image: {
      type: DataTypes.STRING,
      validate: {
        isUrl: true // All images in seed data are URLs, so validate image entry is a URL
      }
    }
  },
  {
    sequelize,
  }
);

module.exports = Item;
