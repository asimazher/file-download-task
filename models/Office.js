// Offices Model

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');


const Office = sequelize.define('Office', {
    officeCode: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    city: DataTypes.STRING,
    phone: DataTypes.STRING,
    addressLine1: DataTypes.STRING,
    addressLine2: DataTypes.STRING,
    state: DataTypes.STRING,
    country: DataTypes.STRING,
    postalCode: DataTypes.STRING,
    territory: DataTypes.STRING,
  }, {
    tableName: 'offices',
    timestamps: false, // Disable createdAt and updatedAt columns
  });
  
  module.exports = Office;