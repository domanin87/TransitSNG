const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();
const logger = require('../logger');
const connection = process.env.DATABASE_URL || 'postgres://postgres:rootpass@localhost:5432/transitsng';
const sequelize = new Sequelize(connection, {
  dialect: 'postgres',
  dialectOptions: connection.includes('sslmode') ? { ssl: { require: true, rejectUnauthorized: false } } : undefined,
  logging: (msg)=> logger.debug(msg)
});

// Используем ENUM с самого начала для новой базы
const User = sequelize.define('User', {
  email: { type: DataTypes.STRING, unique: true, allowNull:false },
  passwordHash: { type: DataTypes.STRING, allowNull:false },
  role: { type: DataTypes.ENUM('user','carrier','moderator','accountant','admin','superadmin'), defaultValue:'user' },
  level: { type: DataTypes.INTEGER, defaultValue:1 },
  preferredLanguage: { type: DataTypes.STRING, defaultValue:'ru' },
  preferredCurrency: { type: DataTypes.STRING, defaultValue: process.env.BASE_CURRENCY || 'KZT' }
}, { tableName:'users', underscored:true });

const Cargo = sequelize.define('Cargo', {
  title: { type: DataTypes.STRING, allowNull:false },
  description: DataTypes.TEXT,
  origin_country: DataTypes.STRING,
  origin_city: DataTypes.STRING,
  dest_country: DataTypes.STRING,
  dest_city: DataTypes.STRING,
  weight: DataTypes.FLOAT,
  price: DataTypes.FLOAT,
  currency: DataTypes.STRING,
  status: { type: DataTypes.ENUM('new','published','in_progress','delivered','cancelled'), defaultValue:'new' },
  map_enabled: { type: DataTypes.BOOLEAN, defaultValue:false }
}, { tableName:'cargos', underscored:true });

const DriverLocation = sequelize.define('DriverLocation', {
  driver_id: DataTypes.INTEGER,
  cargo_id: DataTypes.INTEGER,
  lat: DataTypes.FLOAT,
  lon: DataTypes.FLOAT,
  speed: DataTypes.FLOAT,
  timestamp: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { tableName:'driver_locations', underscored:true });

User.hasMany(Cargo, { foreignKey:'user_id' });
Cargo.belongsTo(User, { foreignKey:'user_id' });

// Для новой базы можно использовать sync без alter
module.exports = { 
  init: async ()=>{ 
    await sequelize.authenticate(); 
    await sequelize.sync(); 
    return { sequelize, User, Cargo, DriverLocation }; 
  }, 
  sequelize, User, Cargo, DriverLocation 
};