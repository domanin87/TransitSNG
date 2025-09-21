'use strict';
module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define('Payment', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    orderId: { type: DataTypes.INTEGER },
    amount: { type: DataTypes.DECIMAL(12,2) },
    currency: { type: DataTypes.STRING },
    status: { type: DataTypes.STRING }
  }, {});
  return Payment;
};
