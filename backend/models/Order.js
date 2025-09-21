'use strict';
module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.UUID },
    driverId: { type: DataTypes.UUID },
    cargoId: { type: DataTypes.INTEGER },
    status: { type: DataTypes.ENUM('new','accepted','in_transit','completed','archived'), defaultValue: 'new' },
    price: { type: DataTypes.DECIMAL(12,2) },
    archived: { type: DataTypes.BOOLEAN, defaultValue: false }
  }, {});
  return Order;
};
