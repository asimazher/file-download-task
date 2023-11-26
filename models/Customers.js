// Customers Model

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');


const Customer = sequelize.define('Customer', {
    customerNumber: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    customerName: DataTypes.STRING,
    contactLastName: DataTypes.STRING,
    contactFirstName: DataTypes.STRING,
    phone: DataTypes.STRING,
    addressLine1: DataTypes.STRING,
    addressLine2: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    postalCode: DataTypes.STRING,
    country: DataTypes.STRING,
    salesRepEmployeeNumber: DataTypes.INTEGER,
    creditLimit: DataTypes.DECIMAL(10, 2),
  }, {
    tableName: 'customers',
    timestamps: false, // Disable createdAt and updatedAt columns
  });
  
  module.exports = Customer;
  