// Employees Model

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');


const Employee = sequelize.define('Employee', {
    employeeNumber: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    lastName: DataTypes.STRING,
    firstName: DataTypes.STRING,
    extension: DataTypes.STRING,
    email: DataTypes.STRING,
    officeCode: DataTypes.STRING,
    reportsTo: DataTypes.INTEGER,
    jobTitle: DataTypes.STRING,
  }, {
    tableName: 'employees',
    timestamps: false, // Disable createdAt and updatedAt columns
  });
  
  module.exports = Employee;