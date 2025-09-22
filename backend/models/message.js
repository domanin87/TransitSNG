const { DataTypes } = require('sequelize');
module.exports = (sequelize) => sequelize.define('Message', {
  id:{ type: DataTypes.INTEGER, primaryKey:true, autoIncrement:true },
  chat_id: DataTypes.STRING,
  from_user: DataTypes.UUID,
  to_user: DataTypes.UUID,
  text: DataTypes.TEXT,
  read: { type: DataTypes.BOOLEAN, defaultValue: false }
}, { tableName: 'messages', timestamps: true });