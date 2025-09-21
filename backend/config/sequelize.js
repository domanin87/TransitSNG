require('dotenv').config();

module.exports = {
  development: {
    url: process.env.DATABASE_URL || 'postgres://transitsng:hQSN60UH1yRTMFWu5XRBB3MGJ576HPHl@dpg-d33fedqdbo4c73b69m1g-a.frankfurt-postgres.render.com/transitsng?sslmode=require',
    dialect: 'postgres',
  },
  production: {
    url: process.env.DATABASE_URL || 'postgres://transitsng:hQSN60UH1yRTMFWu5XRBB3MGJ576HPHl@dpg-d33fedqdbo4c73b69m1g-a.frankfurt-postgres.render.com/transitsng?sslmode=require',
    dialect: 'postgres',
  },
};