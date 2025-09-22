const { DataTypes } = require('sequelize');
module.exports = (sequelize) => sequelize.define('Cargo', {
  id:{ type: DataTypes.INTEGER, primaryKey:true, autoIncrement:true },
  user_id: { type: DataTypes.UUID },
  title: { type: DataTypes.STRING, allowNull:false },
  from_city: DataTypes.STRING,
  to_city: DataTypes.STRING,
  weight_kg: DataTypes.FLOAT,
  volume_m3: DataTypes.FLOAT,
  type: DataTypes.STRING,
  status: { type: DataTypes.STRING, defaultValue: 'published' },
  price: DataTypes.DECIMAL(12,2),
  published_at: DataTypes.DATE
}, { tableName: 'cargos', timestamps: true });