const { Sequelize } = require('sequelize');
const config = require('../config/sequelize.js')['production'];

const sequelize = new Sequelize(config.url, {
  dialect: 'postgres',
  logging: false,
});

// Импорт моделей
const User = require('./user')(sequelize);
const Order = require('./order')(sequelize);
const Payment = require('./payment')(sequelize);
const Tariff = require('./tariff')(sequelize);
const News = require('./news')(sequelize);
const Vacancy = require('./vacancy')(sequelize);

// Связи (ассоциации)
User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(Payment);
Payment.belongsTo(User);

module.exports = {
  sequelize,
  User,
  Order,
  Payment,
  Tariff,
  News,
  Vacancy,
};