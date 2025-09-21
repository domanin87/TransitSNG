const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Payment', {
    amount: { type: DataTypes.FLOAT, allowNull: false },
    description: { type: DataTypes.STRING },
  });
};