// models/Transaction.js
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    static associate(models) {
      Transaction.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
      });
    }
  }

  Transaction.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.STRING(50),
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    type: {
      type: DataTypes.ENUM('subscription', 'cargo_payment', 'withdrawal', 'refund', 'bonus'),
      allowNull: false
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    currency: {
      type: DataTypes.STRING(3),
      defaultValue: '₸'
    },
    status: {
      type: DataTypes.ENUM('pending', 'completed', 'failed', 'cancelled'),
      defaultValue: 'pending'
    },
    payment_method: {
      type: DataTypes.ENUM('card', 'bank_transfer', 'wallet', 'qr'),
      allowNull: false
    },
    payment_details: {
      type: DataTypes.JSONB,
      defaultValue: {}
    },
    description: DataTypes.TEXT,
    related_entity_type: {
      type: DataTypes.ENUM('tariff', 'cargo')
    },
    related_entity_id: DataTypes.INTEGER,
    metadata: DataTypes.JSONB
  }, {
    sequelize,
    modelName: 'Transaction',
    tableName: 'Transactions',
    underscored: true,
    timestamps: true
  });

  return Transaction;
};