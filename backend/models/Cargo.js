'use strict';
module.exports = (sequelize, DataTypes) => {
  const Cargo = sequelize.define('Cargo', {
    fromCity: DataTypes.STRING,
    toCity: DataTypes.STRING,
    weight: DataTypes.FLOAT,
    volume: DataTypes.FLOAT,
    type: DataTypes.STRING,
    price: DataTypes.DECIMAL,
    description: DataTypes.TEXT,
    loadingDate: DataTypes.DATE,
    contactPhone: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {});
  return Cargo;
};
