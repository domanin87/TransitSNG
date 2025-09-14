
const winston = require('winston');
const level = process.env.LOG_LEVEL || 'info';
const logger = winston.createLogger({
  level,
  format: winston.format.combine(winston.format.timestamp(), winston.format.simple()),
  transports: [ new winston.transports.Console() ]
});
module.exports = logger;
