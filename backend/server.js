const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { sequelize } = require('./models');

// роуты
const cargosRoutes = require('./routes/cargos');
const transportRoutes = require('./routes/transport');
const distanceRoutes = require('./routes/distance');
const currencyRoutes = require('./routes/currency');

const app = express();
const PORT = process.env.PORT || 3001;

// миддлвары
app.use(cors());
app.use(bodyParser.json());

// подключение роутов
app.use('/cargos', cargosRoutes);
app.use('/transport', transportRoutes);
app.use('/distance', distanceRoutes);
app.use('/currency', currencyRoutes);

// проверка соединения с БД
sequelize.authenticate()
  .then(() => {
    console.log('✅ Connected to database');
  })
  .catch((err) => {
    console.error('❌ Error connecting to database:', err);
  });

// запуск сервера
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на порту ${PORT}`);
});