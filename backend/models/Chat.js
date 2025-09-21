'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Chat extends Model {
    static associate(models) {
      // Определяем ассоциации
      Chat.belongsToMany(models.User, {
        through: 'ChatParticipants',
        foreignKey: 'chat_id',
        as: 'participants'
      });
      Chat.hasMany(models.Message, {
        foreignKey: 'chat_id',
        as: 'messages'
      });
      Chat.belongsTo(models.Cargo, {
        foreignKey: 'cargo_id',
        as: 'cargo'
      });
    }
  }

  Chat.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    type: {
      type: DataTypes.ENUM('direct', 'group', 'cargo'),
      defaultValue: 'direct'
    },
    name: DataTypes.STRING,
    avatar: DataTypes.STRING,
    is_group: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    cargo_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Cargos',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'Chat',
    tableName: 'Chats',
    underscored: true,
    timestamps: true
  });

  return Chat;
};