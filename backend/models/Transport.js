const { DataTypes } = require('sequelize');
module.exports = (sequelize) => sequelize.define('Transport', {
  id:{ type: DataTypes.INTEGER, primaryKey:true, autoIncrement:true },
  user_id: { type: DataTypes.UUID },
  title: DataTypes.STRING,
  city: DataTypes.STRING,
  capacity_kg: DataTypes.FLOAT,
  body_type: DataTypes.STRING,
  status: { type: DataTypes.STRING, defaultValue: 'available' }
}, { tableName: 'transports', timestamps: true });