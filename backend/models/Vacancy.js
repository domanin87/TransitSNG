const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Vacancy', {
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
  });
};