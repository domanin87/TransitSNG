const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const nodemailer = require('nodemailer');
const { check, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const compression = require('compression');
const moment = require('moment');
const db = require('./src/models');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'https://your-frontend.onrender.com',
    methods: ['GET', 'POST'],
  },
});

app.use(cors({ origin: process.env.FRONTEND_URL || 'https://your-frontend.onrender.com' }));
app.use(express.json());
app.use(helmet());
app.use(compression());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// Sync Sequelize models
db.sequelize.sync({ force: false }).then(() => {
  console.log('Database synced');
}).catch((err) => {
  console.error('Error syncing database:', err.message);
});

// Multer setup
const upload = multer({ dest: 'uploads/' });

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// JWT Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Доступ запрещён' });

  jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret', (err, user) => {
    if (err) return res.status(403).json({ error: 'Неверный токен' });
    req.user = user;
    next();
  });
};

// Socket.IO for messages
io.on('connection', (socket) => {
  console.log('Пользователь подключён:', socket.id);
  socket.on('message', async (message) => {
    try {
      const newMessage = await db.Message.create({
        user_id: message.userId,
        content: message.content,
        timestamp: message.timestamp,
      });
      io.emit('message', newMessage);
    } catch (err) {
      console.error('Ошибка Socket.IO:', err.message);
    }
  });
  socket.on('disconnect', () => {
    console.log('Пользователь отключён:', socket.id);
  });
});

// Message endpoints
app.get('/api/messages', authenticateToken, async (req, res) => {
  try {
    const messages = await db.Message.findAll({ order: [['timestamp', 'ASC']] });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/messages', authenticateToken, async (req, res) => {
  const { userId, content, timestamp } = req.body;
  try {
    const message = await db.Message.create({ user_id: userId, content, timestamp });
    res.json(message);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Service endpoints
app.get('/api/services', async (req, res) => {
  try {
    const services = await db.Service.findAll();
    res.json(services);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Tariff endpoints
app.get('/api/tariffs', async (req, res) => {
  try {
    const tariffs = await db.Tariff.findAll();
    res.json(tariffs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Order endpoints
app.get('/api/orders', authenticateToken, async (req, res) => {
  try {
    const orders = await db.Order.findAll();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/orders', authenticateToken, async (req, res) => {
  const { customer_id } = req.body;
  try {
    const order = await db.Order.create({ customer_id });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/orders/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { customer_id } = req.body;
  try {
    const order = await db.Order.update({ customer_id }, { where: { id }, returning: true });
    res.json(order[1][0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/orders/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    await db.Order.destroy({ where: { id } });
    res.json({ message: 'Заказ удалён' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// User endpoints
app.get('/api/users', authenticateToken, async (req, res) => {
  try {
    const users = await db.User.findAll();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/users/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const user = await db.User.findByPk(id);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/users', authenticateToken, async (req, res) => {
  const { id, name, email, phone } = req.body;
  try {
    const user = await db.User.create({ id, name, email, phone });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/users/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { name, email, phone } = req.body;
  try {
    const user = await db.User.update({ name, email, phone }, { where: { id }, returning: true });
    res.json(user[1][0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/users/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    await db.User.destroy({ where: { id } });
    res.json({ message: 'Пользователь удалён' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Driver endpoints
app.get('/api/drivers', authenticateToken, async (req, res) => {
  try {
    const drivers = await db.Driver.findAll();
    res.json(drivers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/drivers/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const driver = await db.Driver.findByPk(id);
    res.json(driver);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/drivers', authenticateToken, upload.single('license'), async (req, res) => {
  const { name, license_number } = req.body;
  try {
    const driver = await db.Driver.create({ name, license_number });
    res.json(driver);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/drivers/:id', authenticateToken, upload.single('license'), async (req, res) => {
  const { id } = req.params;
  const { name, license_number } = req.body;
  try {
    const driver = await db.Driver.update({ name, license_number }, { where: { id }, returning: true });
    res.json(driver[1][0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/drivers/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    await db.Driver.destroy({ where: { id } });
    res.json({ message: 'Водитель удалён' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Payment endpoints
app.get('/api/payments', authenticateToken, async (req, res) => {
  try {
    const payments = await db.Payment.findAll();
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/payments/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const payment = await db.Payment.findByPk(id);
    res.json(payment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/payments', authenticateToken, async (req, res) => {
  const { order_id, amount } = req.body;
  try {
    const payment = await db.Payment.create({ order_id, amount });
    res.json(payment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/payments/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { order_id, amount } = req.body;
  try {
    const payment = await db.Payment.update({ order_id, amount }, { where: { id }, returning: true });
    res.json(payment[1][0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/payments/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    await db.Payment.destroy({ where: { id } });
    res.json({ message: 'Платёж удалён' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Customer endpoints
app.get('/api/customers', authenticateToken, async (req, res) => {
  try {
    const customers = await db.Customer.findAll();
    res.json(customers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/customers/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const customer = await db.Customer.findByPk(id);
    res.json(customer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/customers', authenticateToken, async (req, res) => {
  const { name, email, phone, company } = req.body;
  try {
    const customer = await db.Customer.create({ name, email, phone, company });
    res.json(customer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/customers/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, company } = req.body;
  try {
    const customer = await db.Customer.update({ name, email, phone, company }, { where: { id }, returning: true });
    res.json(customer[1][0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/customers/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    await db.Customer.destroy({ where: { id } });
    res.json({ message: 'Клиент удалён' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Dashboard endpoints
app.get('/api/dashboard/stats', authenticateToken, async (req, res) => {
  try {
    const orders = await db.Order.count();
    const customers = await db.Customer.count();
    const drivers = await db.Driver.count();
    const payments = await db.Payment.sum('amount');
    res.json({ orders, customers, drivers, payments });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Profile endpoints
app.get('/api/profile', authenticateToken, async (req, res) => {
  try {
    const user = await db.User.findByPk(req.user.userId);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/profile', authenticateToken, async (req, res) => {
  const { name, email, phone } = req.body;
  try {
    const user = await db.User.update({ name, email, phone }, { where: { id: req.user.userId }, returning: true });
    res.json(user[1][0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Settings endpoints
app.get('/api/settings', authenticateToken, async (req, res) => {
  try {
    const settings = await db.Setting.findOne();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/settings', authenticateToken, async (req, res) => {
  const { site_name, currency, language } = req.body;
  try {
    const settings = await db.Setting.update({ site_name, currency, language }, { where: {}, returning: true });
    res.json(settings[1][0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Report endpoints
app.get('/api/reports/orders', authenticateToken, async (req, res) => {
  const { startDate, endDate } = req.query;
  try {
    const orders = await db.Order.findAll({ where: { created_at: { [db.Sequelize.Op.between]: [startDate, endDate] } } });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/reports/payments', authenticateToken, async (req, res) => {
  const { startDate, endDate } = req.query;
  try {
    const payments = await db.Payment.findAll({ where: { created_at: { [db.Sequelize.Op.between]: [startDate, endDate] } } });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/reports/customers', authenticateToken, async (req, res) => {
  const { startDate, endDate } = req.query;
  try {
    const customers = await db.Customer.findAll({ where: { created_at: { [db.Sequelize.Op.between]: [startDate, endDate] } } });
    res.json(customers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Verification endpoints
app.get('/api/verifications', authenticateToken, async (req, res) => {
  try {
    const verifications = await db.Verification.findAll();
    res.json(verifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/verifications/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const verification = await db.Verification.findByPk(id);
    res.json(verification);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/verifications/:id/approve', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const verification = await db.Verification.update({ status: 'approved' }, { where: { id }, returning: true });
    res.json(verification[1][0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/verifications/:id/reject', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const verification = await db.Verification.update({ status: 'rejected' }, { where: { id }, returning: true });
    res.json(verification[1][0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/verifications/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    await db.Verification.destroy({ where: { id } });
    res.json({ message: 'Верификация удалена' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Auth endpoints
app.post('/api/auth/register', [
  check('email').isEmail().normalizeEmail(),
  check('password').isLength({ min: 6 }),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { user_id, email, password, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const auth = await db.Auth.create({ user_id, email, password: hashedPassword, role: role || 'user' });
    const token = jwt.sign({ userId: user_id }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '1h' });
    res.json({ user: auth, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/login', [
  check('email').isEmail().normalizeEmail(),
  check('password').exists(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  try {
    const auth = await db.Auth.findOne({ where: { email } });
    if (!auth) {
      return res.status(401).json({ error: 'Неверные учетные данные' });
    }
    const isMatch = await bcrypt.compare(password, auth.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Неверные учетные данные' });
    }
    const token = jwt.sign({ userId: auth.user_id }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '1h' });
    res.json({ user: auth, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/logout', (req, res) => {
  res.json({ message: 'Выход выполнен' });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});