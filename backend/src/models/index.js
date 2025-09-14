const { Sequelize, DataTypes } = require('sequelize')
const path = require('path')

const DATABASE_URL = process.env.DATABASE_URL || 'sqlite::memory:'
const opts = DATABASE_URL.startsWith('postgres') ? {
  dialect: 'postgres',
  protocol: 'postgres',
  dialectOptions: { ssl: { require: true, rejectUnauthorized: false } },
  logging: false
} : { logging: false }

const sequelize = new Sequelize(DATABASE_URL, opts)

const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, primaryKey:true, autoIncrement:true },
  name: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING, unique:true, allowNull:false },
  passwordHash: { type: DataTypes.STRING },
  role: { type: DataTypes.STRING, defaultValue: 'user' } // use string to avoid enum migration issues
}, { tableName: 'users', underscored:true, timestamps:true })

const Order = sequelize.define('Order', {
  id:{ type: DataTypes.INTEGER, primaryKey:true, autoIncrement:true },
  title: { type: DataTypes.STRING },
  origin: { type: DataTypes.STRING },
  destination: { type: DataTypes.STRING },
  price: { type: DataTypes.FLOAT },
  currency: { type: DataTypes.STRING, defaultValue: 'USD' },
  weight: { type: DataTypes.FLOAT },
  status: { type: DataTypes.STRING, defaultValue: 'pending' },
  trackingEnabled: { type: DataTypes.BOOLEAN, defaultValue: false }
}, { tableName:'orders', underscored:true, timestamps:true })

const Tariff = sequelize.define('Tariff', {
  id:{ type: DataTypes.INTEGER, primaryKey:true, autoIncrement:true },
  name: { type: DataTypes.STRING },
  price_per_ton: { type: DataTypes.FLOAT }
}, { tableName:'tariffs', underscored:true, timestamps:false })

const Message = sequelize.define('Message', {
  id:{ type: DataTypes.INTEGER, primaryKey:true, autoIncrement:true },
  orderId: { type: DataTypes.INTEGER, allowNull:true },
  senderId: { type: DataTypes.INTEGER, allowNull:true },
  text: { type: DataTypes.TEXT }
}, { tableName:'messages', underscored:true, timestamps:true })

User.hasMany(Order, { foreignKey: 'user_id' })
Order.belongsTo(User, { foreignKey: 'user_id' })

module.exports = { sequelize, User, Order, Tariff, Message, initModels: async ()=>{} }
