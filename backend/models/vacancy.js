'use strict';
module.exports = (sequelize, DataTypes) => {
  const Vacancy = sequelize.define('Vacancy', {
    title: DataTypes.TEXT,
    description: DataTypes.TEXT,
    location: DataTypes.STRING,
    salary: DataTypes.STRING,
    isActive: DataTypes.BOOLEAN
  }, {});
  return Vacancy;
};
