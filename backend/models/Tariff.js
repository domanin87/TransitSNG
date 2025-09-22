const { DataTypes } = require('sequelize');
module.exports = (sequelize) => sequelize.define('Tariff', {
  id:{ type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name_ru: DataTypes.STRING,
  name_kk: DataTypes.STRING,
  name_en: DataTypes.STRING,
  city: DataTypes.STRING,
  price: DataTypes.DECIMAL(12,2),
  starts_with: DataTypes.STRING(1),
  active: { type: DataTypes.BOOLEAN, defaultValue: true }
}, { tableName: 'tariffs', timestamps: true });