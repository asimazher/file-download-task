// Orders Model

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');


const Order = sequelize.define('Order', {
    orderNumber: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    orderDate: DataTypes.DATE,
    requiredDate: DataTypes.DATE,
    shippedDate: DataTypes.DATE,
    status: DataTypes.STRING,
    comments: DataTypes.TEXT,
    customerNumber: DataTypes.INTEGER,
  }, {
    tableName: 'orders',
    timestamps: false, // Disable createdAt and updatedAt columns
  });
  
  module.exports = Order;;