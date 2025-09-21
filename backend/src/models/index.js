const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL || 'postgres://transitsng:hQSN60UH1yRTMFWu5XRBB3MGJ576HPHl@dpg-d33fedqdbo4c73b69m1g-a.frankfurt-postgres.render.com/transitsng?sslmode=require', {
  dialect: 'postgres',
  logging: false,
});

const db = {
  Sequelize,
  sequelize,
};

// Define models
db.Message = sequelize.define('Message', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

db.Service = sequelize.define('Service', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
  },
});

db.Tariff = sequelize.define('Tariff', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  rate: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
});

db.Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  customer_id: {
    type: DataTypes.STRING(50),
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.fn('NOW'),
  },
});

db.User = sequelize.define('User', {
  id: {
    type: DataTypes.STRING(50),
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(100),
  },
  email: {
    type: DataTypes.STRING(100),
  },
  phone: {
    type: DataTypes.STRING(20),
  },
});

db.Driver = sequelize.define('Driver', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(100),
  },
  license_number: {
    type: DataTypes.STRING(50),
  },
});

db.Payment = sequelize.define('Payment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  order_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Orders',
      key: 'id',
    },
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
  },
});

db.Customer = sequelize.define('Customer', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(100),
  },
  email: {
    type: DataTypes.STRING(100),
  },
  phone: {
    type: DataTypes.STRING(20),
  },
  company: {
    type: DataTypes.STRING(100),
  },
});

db.Setting = sequelize.define('Setting', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  site_name: {
    type: DataTypes.STRING(100),
  },
  currency: {
    type: DataTypes.STRING(10),
  },
  language: {
    type: DataTypes.STRING(10),
  },
});

db.Verification = sequelize.define('Verification', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.STRING(50),
  },
  type: {
    type: DataTypes.STRING(50),
  },
  status: {
    type: DataTypes.STRING(20),
  },
  submitted_at: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.fn('NOW'),
  },
});

db.Auth = sequelize.define('Auth', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
});

module.exports = db;