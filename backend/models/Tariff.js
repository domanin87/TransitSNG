const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Tariff', {
    city: { type: DataTypes.STRING, allowNull: false },
    pricePerKg: { type: DataTypes.FLOAT, allowNull: false },
  });
};