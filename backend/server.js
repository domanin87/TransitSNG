const express = require('express');
const { Pool } = require('pg');
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

// Подключение к PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://transitsng:hQSN60UH1yRTMFWu5XRBB3MGJ576HPHl@dpg-d33fedqdbo4c73b69m1g-a.frankfurt-postgres.render.com/transitsng?sslmode=require',
});

// Настройка Multer для загрузки файлов
const upload = multer({ dest: 'uploads/' });

// Настройка Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Middleware для проверки JWT
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

// Socket.IO для сообщений
io.on('connection', (socket) => {
  console.log('Пользователь подключён:', socket.id);
  socket.on('message', async (message) => {
    try {
      const result = await pool.query(
        'INSERT INTO messages (user_id, content, timestamp) VALUES ($1, $2, $3) RETURNING *',
        [message.userId, message.content, message.timestamp]
      );
      io.emit('message', result.rows[0]);
    } catch (err) {
      console.error('Ошибка Socket.IO:', err.message);
    }
  });
  socket.on('disconnect', () => {
    console.log('Пользователь отключён:', socket.id);
  });
});

// Эндпоинты для сообщений
app.get('/api/messages', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM messages ORDER BY timestamp ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/messages', authenticateToken, async (req, res) => {
  const { userId, content, timestamp } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO messages (user_id, content, timestamp) VALUES ($1, $2, $3) RETURNING *',
      [userId, content, timestamp]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Эндпоинты для сервисов
app.get('/api/services', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM services');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Эндпоинты для тарифов
app.get('/api/tariffs', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tariffs');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Эндпоинты для заказов
app.get('/api/orders', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM orders');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/orders', authenticateToken, async (req, res) => {
  const { customer_id } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO orders (customer_id) VALUES ($1) RETURNING *',
      [customer_id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/orders/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { customer_id } = req.body;
  try {
    const result = await pool.query(
      'UPDATE orders SET customer_id = $1 WHERE id = $2 RETURNING *',
      [customer_id, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/orders/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM orders WHERE id = $1', [id]);
    res.json({ message: 'Заказ удалён' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Эндпоинты для пользователей
app.get('/api/users', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/users/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/users', authenticateToken, async (req, res) => {
  const { id, name, email, phone } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO users (id, name, email, phone) VALUES ($1, $2, $3, $4) RETURNING *',
      [id, name, email, phone]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/users/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { name, email, phone } = req.body;
  try {
    const result = await pool.query(
      'UPDATE users SET name = $1, email = $2, phone = $3 WHERE id = $4 RETURNING *',
      [name, email, phone, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/users/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
    res.json({ message: 'Пользователь удалён' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Эндпоинты для водителей
app.get('/api/drivers', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM drivers');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/drivers/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM drivers WHERE id = $1', [id]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/drivers', authenticateToken, upload.single('license'), async (req, res) => {
  const { name, license_number } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO drivers (name, license_number) VALUES ($1, $2) RETURNING *',
      [name, license_number]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/drivers/:id', authenticateToken, upload.single('license'), async (req, res) => {
  const { id } = req.params;
  const { name, license_number } = req.body;
  try {
    const result = await pool.query(
      'UPDATE drivers SET name = $1, license_number = $2 WHERE id = $3 RETURNING *',
      [name, license_number, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/drivers/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM drivers WHERE id = $1', [id]);
    res.json({ message: 'Водитель удалён' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Эндпоинты для платежей
app.get('/api/payments', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM payments');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/payments/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM payments WHERE id = $1', [id]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/payments', authenticateToken, async (req, res) => {
  const { order_id, amount } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO payments (order_id, amount) VALUES ($1, $2) RETURNING *',
      [order_id, amount]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/payments/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { order_id, amount } = req.body;
  try {
    const result = await pool.query(
      'UPDATE payments SET order_id = $1, amount = $2 WHERE id = $3 RETURNING *',
      [order_id, amount, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/payments/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM payments WHERE id = $1', [id]);
    res.json({ message: 'Платёж удалён' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Эндпоинты для клиентов
app.get('/api/customers', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM customers');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/customers/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM customers WHERE id = $1', [id]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/customers', authenticateToken, async (req, res) => {
  const { name, email, phone, company } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO customers (name, email, phone, company) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, email, phone, company]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/customers/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, company } = req.body;
  try {
    const result = await pool.query(
      'UPDATE customers SET name = $1, email = $2, phone = $3, company = $4 WHERE id = $5 RETURNING *',
      [name, email, phone, company, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/customers/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM customers WHERE id = $1', [id]);
    res.json({ message: 'Клиент удалён' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Эндпоинты для дашборда
app.get('/api/dashboard/stats', authenticateToken, async (req, res) => {
  try {
    const orders = await pool.query('SELECT COUNT(*) FROM orders');
    const customers = await pool.query('SELECT COUNT(*) FROM customers');
    const drivers = await pool.query('SELECT COUNT(*) FROM drivers');
    const payments = await pool.query('SELECT SUM(amount) FROM payments');
    res.json({
      orders: orders.rows[0].count,
      customers: customers.rows[0].count,
      drivers: drivers.rows[0].count,
      payments: payments.rows[0].sum,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Эндпоинты для профиля
app.get('/api/profile', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [req.user.userId]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/profile', authenticateToken, async (req, res) => {
  const { name, email, phone } = req.body;
  try {
    const result = await pool.query(
      'UPDATE users SET name = $1, email = $2, phone = $3 WHERE id = $4 RETURNING *',
      [name, email, phone, req.user.userId]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Эндпоинты для настроек
app.get('/api/settings', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM settings LIMIT 1');
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/settings', authenticateToken, async (req, res) => {
  const { site_name, currency, language } = req.body;
  try {
    const result = await pool.query(
      'UPDATE settings SET site_name = $1, currency = $2, language = $3 RETURNING *',
      [site_name, currency, language]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Эндпоинты для отчетов
app.get('/api/reports/orders', authenticateToken, async (req, res) => {
  const { startDate, endDate } = req.query;
  try {
    const result = await pool.query(
      'SELECT * FROM orders WHERE created_at BETWEEN $1 AND $2',
      [startDate, endDate]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/reports/payments', authenticateToken, async (req, res) => {
  const { startDate, endDate } = req.query;
  try {
    const result = await pool.query(
      'SELECT * FROM payments WHERE created_at BETWEEN $1 AND $2',
      [startDate, endDate]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/reports/customers', authenticateToken, async (req, res) => {
  const { startDate, endDate } = req.query;
  try {
    const result = await pool.query(
      'SELECT * FROM customers WHERE created_at BETWEEN $1 AND $2',
      [startDate, endDate]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Эндпоинты для верификаций
app.get('/api/verifications', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM verifications');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/verifications/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM verifications WHERE id = $1', [id]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/verifications/:id/approve', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'UPDATE verifications SET status = $1 WHERE id = $2 RETURNING *',
      ['approved', id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/verifications/:id/reject', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'UPDATE verifications SET status = $1 WHERE id = $2 RETURNING *',
      ['rejected', id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/verifications/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM verifications WHERE id = $1', [id]);
    res.json({ message: 'Верификация удалена' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Эндпоинты для авторизации
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
    const result = await pool.query(
      'INSERT INTO auth (user_id, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *',
      [user_id, email, hashedPassword, role || 'user']
    );
    const token = jwt.sign({ userId: user_id }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '1h' });
    res.json({ user: result.rows[0], token });
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
    const result = await pool.query('SELECT * FROM auth WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Неверные учетные данные' });
    }
    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Неверные учетные данные' });
    }
    const token = jwt.sign({ userId: user.user_id }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '1h' });
    res.json({ user, token });
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