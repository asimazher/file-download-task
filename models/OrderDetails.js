// OrderDetails Model

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');


const OrderDetails = sequelize.define('OrderDetails', {
    orderNumber: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
    productCode: DataTypes.STRING,
    quantityOrdered: DataTypes.INTEGER,
    priceEach: DataTypes.DECIMAL(10, 2),
    orderLineNumber: DataTypes.SMALLINT,
  }, {
    tableName: 'orderdetails',
    timestamps: false, // Disable createdAt and updatedAt columns
  });
  
  module.exports = OrderDetails;
  