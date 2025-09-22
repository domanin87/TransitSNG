const { DataTypes } = require('sequelize');
module.exports = (sequelize) => sequelize.define('Vacancy', {
  id:{ type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title_ru: { type: DataTypes.STRING, allowNull: false },
  title_kk: { type: DataTypes.STRING, allowNull: true },
  title_en: { type: DataTypes.STRING, allowNull: true },
  description_ru: DataTypes.TEXT,
  description_kk: DataTypes.TEXT,
  description_en: DataTypes.TEXT,
  location: DataTypes.STRING,
  salary: DataTypes.STRING
}, { tableName: 'vacancies', timestamps: true });