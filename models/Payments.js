// Payments Model

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');


const Payment = sequelize.define('Payment', {
    customerNumber: DataTypes.INTEGER,
    checkNumber: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    paymentDate: DataTypes.DATE,
    amount: DataTypes.DECIMAL(10, 2),
  }, {
    tableName: 'payments',
    timestamps: false, // Disable createdAt and updatedAt columns
  });
  
  module.exports = Payment;;