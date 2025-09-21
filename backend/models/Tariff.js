'use strict';
module.exports = (sequelize, DataTypes) => {
  const Tariff = sequelize.define('Tariff', {
    name: DataTypes.STRING,
    city: DataTypes.STRING,
    price: DataTypes.DECIMAL,
    startsWith: DataTypes.STRING,
    active: DataTypes.BOOLEAN
  }, {});
  return Tariff;
};
