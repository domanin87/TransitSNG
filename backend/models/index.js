'use strict';
const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const DATABASE_URL = process.env.DATABASE_URL || null;

let sequelize;
if (DATABASE_URL) {
  sequelize = new Sequelize(DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
  });
} else {
  sequelize = new Sequelize(process.env.DB_NAME || 'transitsng', process.env.DB_USER || 'postgres', process.env.DB_PASS || 'postgres', {
    host: process.env.DB_HOST || '127.0.0.1',
    dialect: 'postgres',
    logging: false
  });
}

const db = {};

// load models dynamically
const fs = require('fs');
const path = require('path');
fs.readdirSync(__dirname).filter(file => file !== 'index.js' && file.endsWith('.js')).forEach(file => {
  const model = require(path.join(__dirname, file))(sequelize, DataTypes);
  db[model.name] = model;
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;
module.exports = db;
