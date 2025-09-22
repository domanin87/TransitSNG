const { DataTypes } = require('sequelize');
module.exports = (sequelize) => sequelize.define('News', {
  id:{ type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title_ru: { type: DataTypes.STRING, allowNull: false },
  title_kk: { type: DataTypes.STRING, allowNull: true },
  title_en: { type: DataTypes.STRING, allowNull: true },
  content_ru: DataTypes.TEXT,
  content_kk: DataTypes.TEXT,
  content_en: DataTypes.TEXT,
  is_published: { type: DataTypes.BOOLEAN, defaultValue: false }
}, { tableName: 'news', timestamps: true });