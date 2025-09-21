'use strict';
module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define('Payment', {
    orderId: DataTypes.INTEGER,
    amount: DataTypes.DECIMAL,
    currency: DataTypes.STRING,
    status: DataTypes.STRING
  }, {});
  return Payment;
};
