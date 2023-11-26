// ProductLines Model


const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');


const ProductLine = sequelize.define('ProductLine', {
    productLine: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    textDescription: DataTypes.STRING(4000),
    htmlDescription: DataTypes.TEXT,
    image: DataTypes.BLOB('medium'),
  }, {
    tableName: 'productlines',
    timestamps: false, // Disable createdAt and updatedAt columns
  });
  
  module.exports = ProductLine;