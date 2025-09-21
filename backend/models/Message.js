// models/Message.js
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    static associate(models) {
      Message.belongsTo(models.Chat, {
        foreignKey: 'chat_id',
        as: 'chat'
      });
      Message.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
      });
    }
  }

  Message.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    chat_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Chats',
        key: 'id'
      }
    },
    user_id: {
      type: DataTypes.STRING(50),
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    content: DataTypes.TEXT,
    type: {
      type: DataTypes.ENUM('text', 'image', 'file', 'location'),
      defaultValue: 'text'
    },
    attachments: DataTypes.JSONB,
    read_by: DataTypes.JSONB
  }, {
    sequelize,
    modelName: 'Message',
    tableName: 'Messages',
    underscored: true,
    timestamps: true
  });

  return Message;
};