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
const path = require('path');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// Настройка CORS для фронтенда и бэкенда
const allowedOrigins = [
  'https://transitsng-frontend.onrender.com',
  'https://transitsng.onrender.com',
  'http://localhost:3000'
];

const io = new Server(server, {
  cors: {
    origin: function(origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST'],
    credentials: true
  },
});

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));
app.use(compression());

// Лимитер запросов
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Слишком много запросов с этого IP, пожалуйста, попробуйте позже.'
});
app.use(limiter);

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

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
  
  if (!token) {
    return res.status(401).json({ error: 'Доступ запрещён. Токен отсутствует.' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Неверный или просроченный токен.' });
    }
    req.user = user;
    next();
  });
};

// Admin middleware
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Требуются права администратора.' });
  }
  next();
};

// Sync Sequelize models
db.sequelize.authenticate()
  .then(() => {
    console.log('Database connection established successfully.');
    
    // В production используем только миграции, в development - sync
    if (process.env.NODE_ENV === 'development') {
      return db.sequelize.sync({ force: false });
    }
    return Promise.resolve();
  })
  .then(() => {
    console.log('Database synchronized successfully.');
  })
  .catch((err) => {
    console.error('Error connecting to database:', err.message);
  });

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    await db.sequelize.authenticate();
    res.status(200).json({ 
      status: 'OK', 
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'ERROR', 
      database: 'disconnected',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Socket.IO for real-time communication
io.on('connection', (socket) => {
  console.log('Пользователь подключён:', socket.id);
  
  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    console.log(`Пользователь ${socket.id} присоединился к комнате ${roomId}`);
  });
  
  socket.on('message', async (message) => {
    try {
      const newMessage = await db.Message.create({
        user_id: message.userId,
        content: message.content,
        timestamp: new Date(),
      });
      
      // Отправляем сообщение всем в комнате
      io.to(message.roomId || 'general').emit('new-message', newMessage);
    } catch (err) {
      console.error('Ошибка Socket.IO:', err.message);
      socket.emit('error', { message: 'Ошибка отправки сообщения' });
    }
  });
  
  socket.on('order-update', async (data) => {
    try {
      // Обновляем статус заказа в БД
      await db.Order.update(
        { status: data.status },
        { where: { id: data.orderId } }
      );
      
      // Уведомляем всех заинтересованных пользователей
      io.to(`order-${data.orderId}`).emit('order-updated', data);
    } catch (err) {
      console.error('Ошибка обновления заказа:', err.message);
    }
  });
  
  socket.on('disconnect', () => {
    console.log('Пользователь отключён:', socket.id);
  });
});

// Message endpoints
app.get('/api/messages', authenticateToken, async (req, res) => {
  try {
    const { roomId, limit = 50, offset = 0 } = req.query;
    let whereCondition = {};
    
    if (roomId) {
      whereCondition.room_id = roomId;
    }
    
    const messages = await db.Message.findAll({
      where: whereCondition,
      order: [['timestamp', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
    
    res.json(messages.reverse());
  } catch (err) {
    console.error('Ошибка получения сообщений:', err);
    res.status(500).json({ error: 'Ошибка при получении сообщений' });
  }
});

app.post('/api/messages', authenticateToken, async (req, res) => {
  try {
    const { userId, content, roomId } = req.body;
    
    if (!content || !userId) {
      return res.status(400).json({ error: 'Отсутствуют обязательные поля' });
    }
    
    const message = await db.Message.create({ 
      user_id: userId, 
      content, 
      room_id: roomId || 'general',
      timestamp: new Date()
    });
    
    // Отправляем через socket.io
    io.to(roomId || 'general').emit('new-message', message);
    
    res.json(message);
  } catch (err) {
    console.error('Ошибка создания сообщения:', err);
    res.status(500).json({ error: 'Ошибка при создании сообщения' });
  }
});

// Service endpoints
app.get('/api/services', async (req, res) => {
  try {
    const services = await db.Service.findAll({
      order: [['name', 'ASC']]
    });
    res.json(services);
  } catch (err) {
    console.error('Ошибка получения услуг:', err);
    res.status(500).json({ error: 'Ошибка при получении услуг' });
  }
});

app.post('/api/services', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name, description, price } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Название услуги обязательно' });
    }
    
    const service = await db.Service.create({ name, description, price });
    res.json(service);
  } catch (err) {
    console.error('Ошибка создания услуги:', err);
    res.status(500).json({ error: 'Ошибка при создании услуги' });
  }
});

// Tariff endpoints
app.get('/api/tariffs', async (req, res) => {
  try {
    const tariffs = await db.Tariff.findAll({
      order: [['name', 'ASC']]
    });
    res.json(tariffs);
  } catch (err) {
    console.error('Ошибка получения тарифов:', err);
    res.status(500).json({ error: 'Ошибка при получении тарифов' });
  }
});

app.post('/api/tariffs', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name, rate } = req.body;
    
    if (!name || !rate) {
      return res.status(400).json({ error: 'Название и ставка тарифа обязательны' });
    }
    
    const tariff = await db.Tariff.create({ name, rate });
    res.json(tariff);
  } catch (err) {
    console.error('Ошибка создания тарифа:', err);
    res.status(500).json({ error: 'Ошибка при создании тарифа' });
  }
});

// Order endpoints
app.get('/api/orders', authenticateToken, async (req, res) => {
  try {
    const { status, customer_id, limit = 50, offset = 0 } = req.query;
    let whereCondition = {};
    
    if (status) {
      whereCondition.status = status;
    }
    
    if (customer_id) {
      whereCondition.customer_id = customer_id;
    }
    
    const orders = await db.Order.findAll({
      where: whereCondition,
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [
        { model: db.Customer, as: 'customer' },
        { model: db.Payment, as: 'payments' }
      ]
    });
    
    res.json(orders);
  } catch (err) {
    console.error('Ошибка получения заказов:', err);
    res.status(500).json({ error: 'Ошибка при получении заказов' });
  }
});

app.get('/api/orders/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const order = await db.Order.findByPk(id, {
      include: [
        { model: db.Customer, as: 'customer' },
        { model: db.Payment, as: 'payments' },
        { model: db.Driver, as: 'driver' }
      ]
    });
    
    if (!order) {
      return res.status(404).json({ error: 'Заказ не найден' });
    }
    
    res.json(order);
  } catch (err) {
    console.error('Ошибка получения заказа:', err);
    res.status(500).json({ error: 'Ошибка при получении заказа' });
  }
});

app.post('/api/orders', authenticateToken, async (req, res) => {
  try {
    const { customer_id, service_id, tariff_id, details } = req.body;
    
    if (!customer_id) {
      return res.status(400).json({ error: 'ID клиента обязателен' });
    }
    
    const order = await db.Order.create({ 
      customer_id, 
      service_id, 
      tariff_id,
      details: details || {},
      status: 'pending'
    });
    
    res.status(201).json(order);
  } catch (err) {
    console.error('Ошибка создания заказа:', err);
    res.status(500).json({ error: 'Ошибка при создании заказа' });
  }
});

app.put('/api/orders/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { customer_id, status, driver_id, details } = req.body;
    
    const order = await db.Order.findByPk(id);
    if (!order) {
      return res.status(404).json({ error: 'Заказ не найден' });
    }
    
    const updatedOrder = await order.update({
      customer_id: customer_id || order.customer_id,
      status: status || order.status,
      driver_id: driver_id || order.driver_id,
      details: details ? { ...order.details, ...details } : order.details
    });
    
    // Уведомляем через socket.io об изменении заказа
    io.emit('order-updated', { orderId: id, status: updatedOrder.status });
    
    res.json(updatedOrder);
  } catch (err) {
    console.error('Ошибка обновления заказа:', err);
    res.status(500).json({ error: 'Ошибка при обновлении заказа' });
  }
});

app.delete('/api/orders/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const order = await db.Order.findByPk(id);
    if (!order) {
      return res.status(404).json({ error: 'Заказ не найден' });
    }
    
    await order.destroy();
    res.json({ message: 'Заказ удалён' });
  } catch (err) {
    console.error('Ошибка удаления заказа:', err);
    res.status(500).json({ error: 'Ошибка при удалении заказа' });
  }
});

// User endpoints
app.get('/api/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const users = await db.User.findAll({
      order: [['name', 'ASC']]
    });
    res.json(users);
  } catch (err) {
    console.error('Ошибка получения пользователей:', err);
    res.status(500).json({ error: 'Ошибка при получении пользователей' });
  }
});

app.get('/api/users/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Пользователи могут получать только свою информацию, админы - любую
    if (req.user.role !== 'admin' && req.user.userId !== id) {
      return res.status(403).json({ error: 'Недостаточно прав' });
    }
    
    const user = await db.User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }
    
    res.json(user);
  } catch (err) {
    console.error('Ошибка получения пользователя:', err);
    res.status(500).json({ error: 'Ошибка при получении пользователя' });
  }
});

app.post('/api/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id, name, email, phone } = req.body;
    
    if (!id || !name || !email) {
      return res.status(400).json({ error: 'ID, имя и email обязательны' });
    }
    
    const user = await db.User.create({ id, name, email, phone });
    res.status(201).json(user);
  } catch (err) {
    console.error('Ошибка создания пользователя:', err);
    res.status(500).json({ error: 'Ошибка при создании пользователя' });
  }
});

app.put('/api/users/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone } = req.body;
    
    // Пользователи могут обновлять только свою информацию, админы - любую
    if (req.user.role !== 'admin' && req.user.userId !== id) {
      return res.status(403).json({ error: 'Недостаточно прав' });
    }
    
    const user = await db.User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }
    
    const updatedUser = await user.update({ name, email, phone });
    res.json(updatedUser);
  } catch (err) {
    console.error('Ошибка обновления пользователя:', err);
    res.status(500).json({ error: 'Ошибка при обновлении пользователя' });
  }
});

app.delete('/api/users/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await db.User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }
    
    await user.destroy();
    res.json({ message: 'Пользователь удалён' });
  } catch (err) {
    console.error('Ошибка удаления пользователя:', err);
    res.status(500).json({ error: 'Ошибка при удалении пользователя' });
  }
});

// Driver endpoints
app.get('/api/drivers', authenticateToken, async (req, res) => {
  try {
    const { status } = req.query;
    let whereCondition = {};
    
    if (status) {
      whereCondition.status = status;
    }
    
    const drivers = await db.Driver.findAll({
      where: whereCondition,
      order: [['name', 'ASC']]
    });
    res.json(drivers);
  } catch (err) {
    console.error('Ошибка получения водителей:', err);
    res.status(500).json({ error: 'Ошибка при получении водителей' });
  }
});

app.get('/api/drivers/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const driver = await db.Driver.findByPk(id);
    
    if (!driver) {
      return res.status(404).json({ error: 'Водитель не найден' });
    }
    
    res.json(driver);
  } catch (err) {
    console.error('Ошибка получения водителя:', err);
    res.status(500).json({ error: 'Ошибка при получении водителя' });
  }
});

app.post('/api/drivers', authenticateToken, requireAdmin, upload.single('license'), async (req, res) => {
  try {
    const { name, license_number, phone } = req.body;
    
    if (!name || !license_number) {
      return res.status(400).json({ error: 'Имя и номер лицензии обязательны' });
    }
    
    const driverData = {
      name,
      license_number,
      phone: phone || null,
      status: 'available'
    };
    
    if (req.file) {
      driverData.license_image = `/uploads/${req.file.filename}`;
    }
    
    const driver = await db.Driver.create(driverData);
    res.status(201).json(driver);
  } catch (err) {
    console.error('Ошибка создания водителя:', err);
    res.status(500).json({ error: 'Ошибка при создании водителя' });
  }
});

app.put('/api/drivers/:id', authenticateToken, requireAdmin, upload.single('license'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, license_number, phone, status } = req.body;
    
    const driver = await db.Driver.findByPk(id);
    if (!driver) {
      return res.status(404).json({ error: 'Водитель не найден' });
    }
    
    const updateData = {};
    if (name) updateData.name = name;
    if (license_number) updateData.license_number = license_number;
    if (phone) updateData.phone = phone;
    if (status) updateData.status = status;
    
    if (req.file) {
      updateData.license_image = `/uploads/${req.file.filename}`;
    }
    
    const updatedDriver = await driver.update(updateData);
    res.json(updatedDriver);
  } catch (err) {
    console.error('Ошибка обновления водителя:', err);
    res.status(500).json({ error: 'Ошибка при обновления водителя' });
  }
});

app.delete('/api/drivers/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const driver = await db.Driver.findByPk(id);
    if (!driver) {
      return res.status(404).json({ error: 'Водитель не найден' });
    }
    
    await driver.destroy();
    res.json({ message: 'Водитель удалён' });
  } catch (err) {
    console.error('Ошибка удаления водителя:', err);
    res.status(500).json({ error: 'Ошибка при удалении водителя' });
  }
});

// Payment endpoints
app.get('/api/payments', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status, order_id } = req.query;
    let whereCondition = {};
    
    if (status) {
      whereCondition.status = status;
    }
    
    if (order_id) {
      whereCondition.order_id = order_id;
    }
    
    const payments = await db.Payment.findAll({
      where: whereCondition,
      order: [['created_at', 'DESC']],
      include: [{ model: db.Order, as: 'order' }]
    });
    res.json(payments);
  } catch (err) {
    console.error('Ошибка получения платежей:', err);
    res.status(500).json({ error: 'Ошибка при получении платежей' });
  }
});

app.get('/api/payments/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const payment = await db.Payment.findByPk(id, {
      include: [{ model: db.Order, as: 'order' }]
    });
    
    if (!payment) {
      return res.status(404).json({ error: 'Платёж не найден' });
    }
    
    res.json(payment);
  } catch (err) {
    console.error('Ошибка получения платежа:', err);
    res.status(500).json({ error: 'Ошибка при получении платежа' });
  }
});

app.post('/api/payments', authenticateToken, async (req, res) => {
  try {
    const { order_id, amount, method } = req.body;
    
    if (!order_id || !amount) {
      return res.status(400).json({ error: 'ID заказа и сумма обязательны' });
    }
    
    const payment = await db.Payment.create({
      order_id,
      amount,
      method: method || 'card',
      status: 'pending'
    });
    
    res.status(201).json(payment);
  } catch (err) {
    console.error('Ошибка создания платежа:', err);
    res.status(500).json({ error: 'Ошибка при создании платежа' });
  }
});

app.put('/api/payments/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const payment = await db.Payment.findByPk(id);
    if (!payment) {
      return res.status(404).json({ error: 'Платёж не найден' });
    }
    
    const updatedPayment = await payment.update({ status });
    res.json(updatedPayment);
  } catch (err) {
    console.error('Ошибка обновления платежа:', err);
    res.status(500).json({ error: 'Ошибка при обновления платежа' });
  }
});

app.delete('/api/payments/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const payment = await db.Payment.findByPk(id);
    if (!payment) {
      return res.status(404).json({ error: 'Платёж не найден' });
    }
    
    await payment.destroy();
    res.json({ message: 'Платёж удалён' });
  } catch (err) {
    console.error('Ошибка удаления платежа:', err);
    res.status(500).json({ error: 'Ошибка при удалении платежа' });
  }
});

// Customer endpoints
app.get('/api/customers', authenticateToken, async (req, res) => {
  try {
    const { company } = req.query;
    let whereCondition = {};
    
    if (company) {
      whereCondition.company = company;
    }
    
    const customers = await db.Customer.findAll({
      where: whereCondition,
      order: [['name', 'ASC']]
    });
    res.json(customers);
  } catch (err) {
    console.error('Ошибка получения клиентов:', err);
    res.status(500).json({ error: 'Ошибка при получении клиентов' });
  }
});

app.get('/api/customers/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await db.Customer.findByPk(id);
    
    if (!customer) {
      return res.status(404).json({ error: 'Клиент не найден' });
    }
    
    res.json(customer);
  } catch (err) {
    console.error('Ошибка получения клиента:', err);
    res.status(500).json({ error: 'Ошибка при получении клиента' });
  }
});

app.post('/api/customers', authenticateToken, async (req, res) => {
  try {
    const { name, email, phone, company } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Имя клиента обязательно' });
    }
    
    const customer = await db.Customer.create({ name, email, phone, company });
    res.status(201).json(customer);
  } catch (err) {
    console.error('Ошибка создания клиента:', err);
    res.status(500).json({ error: 'Ошибка при создании клиента' });
  }
});

app.put('/api/customers/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, company } = req.body;
    
    const customer = await db.Customer.findByPk(id);
    if (!customer) {
      return res.status(404).json({ error: 'Клиент не найден' });
    }
    
    const updatedCustomer = await customer.update({ name, email, phone, company });
    res.json(updatedCustomer);
  } catch (err) {
    console.error('Ошибка обновления клиента:', err);
    res.status(500).json({ error: 'Ошибка при обновления клиента' });
  }
});

app.delete('/api/customers/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const customer = await db.Customer.findByPk(id);
    if (!customer) {
      return res.status(404).json({ error: 'Клиент не найден' });
    }
    
    await customer.destroy();
    res.json({ message: 'Клиент удалён' });
  } catch (err) {
    console.error('Ошибка удаления клиента:', err);
    res.status(500).json({ error: 'Ошибка при удалении клиента' });
  }
});

// Dashboard endpoints
app.get('/api/dashboard/stats', authenticateToken, async (req, res) => {
  try {
    const orders = await db.Order.count();
    const customers = await db.Customer.count();
    const drivers = await db.Driver.count();
    const payments = await db.Payment.sum('amount', { where: { status: 'completed' } });
    
    // Статистика по статусам заказов
    const orderStatusStats = await db.Order.findAll({
      attributes: ['status', [db.sequelize.fn('COUNT', 'status'), 'count']],
      group: ['status']
    });
    
    // Доход по месяцам за последние 6 месяцев
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const revenueByMonth = await db.Payment.findAll({
      attributes: [
        [db.sequelize.fn('DATE_TRUNC', 'month', db.sequelize.col('created_at')), 'month'],
        [db.sequelize.fn('SUM', db.sequelize.col('amount')), 'total']
      ],
      where: {
        status: 'completed',
        created_at: {
          [db.Sequelize.Op.gte]: sixMonthsAgo
        }
      },
      group: [db.sequelize.fn('DATE_TRUNC', 'month', db.sequelize.col('created_at'))],
      order: [[db.sequelize.fn('DATE_TRUNC', 'month', db.sequelize.col('created_at')), 'ASC']]
    });
    
    res.json({
      orders,
      customers,
      drivers,
      payments: payments || 0,
      orderStatusStats,
      revenueByMonth
    });
  } catch (err) {
    console.error('Ошибка получения статистики:', err);
    res.status(500).json({ error: 'Ошибка при получении статистики' });
  }
});

// Profile endpoints
app.get('/api/profile', authenticateToken, async (req, res) => {
  try {
    const user = await db.User.findByPk(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }
    
    res.json(user);
  } catch (err) {
    console.error('Ошибка получения профиля:', err);
    res.status(500).json({ error: 'Ошибка при получении профиля' });
  }
});

app.put('/api/profile', authenticateToken, async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    
    const user = await db.User.findByPk(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }
    
    const updatedUser = await user.update({ name, email, phone });
    res.json(updatedUser);
  } catch (err) {
    console.error('Ошибка обновления профиля:', err);
    res.status(500).json({ error: 'Ошибка при обновлении профиля' });
  }
});

// Settings endpoints
app.get('/api/settings', authenticateToken, async (req, res) => {
  try {
    let settings = await db.Setting.findOne();
    
    if (!settings) {
      // Создаем настройки по умолчанию, если их нет
      settings = await db.Setting.create({
        site_name: 'TransiSNG',
        currency: 'RUB',
        language: 'ru'
      });
    }
    
    res.json(settings);
  } catch (err) {
    console.error('Ошибка получения настроек:', err);
    res.status(500).json({ error: 'Ошибка при получении настроек' });
  }
});

app.put('/api/settings', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { site_name, currency, language } = req.body;
    
    let settings = await db.Setting.findOne();
    
    if (!settings) {
      settings = await db.Setting.create({ site_name, currency, language });
    } else {
      settings = await settings.update({ site_name, currency, language });
    }
    
    res.json(settings);
  } catch (err) {
    console.error('Ошибка обновления настроек:', err);
    res.status(500).json({ error: 'Ошибка при обновлении настроек' });
  }
});

// Report endpoints
app.get('/api/reports/orders', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { startDate, endDate, status } = req.query;
    let whereCondition = {};
    
    if (startDate && endDate) {
      whereCondition.created_at = {
        [db.Sequelize.Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }
    
    if (status) {
      whereCondition.status = status;
    }
    
    const orders = await db.Order.findAll({
      where: whereCondition,
      order: [['created_at', 'DESC']],
      include: [
        { model: db.Customer, as: 'customer' },
        { model: db.Payment, as: 'payments' }
      ]
    });
    
    res.json(orders);
  } catch (err) {
    console.error('Ошибка получения отчета по заказам:', err);
    res.status(500).json({ error: 'Ошибка при получении отчета по заказам' });
  }
});

app.get('/api/reports/payments', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { startDate, endDate, status } = req.query;
    let whereCondition = {};
    
    if (startDate && endDate) {
      whereCondition.created_at = {
        [db.Sequelize.Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }
    
    if (status) {
      whereCondition.status = status;
    }
    
    const payments = await db.Payment.findAll({
      where: whereCondition,
      order: [['created_at', 'DESC']],
      include: [{ model: db.Order, as: 'order' }]
    });
    
    res.json(payments);
  } catch (err) {
    console.error('Ошибка получения отчета по платежам:', err);
    res.status(500).json({ error: 'Ошибка при получении отчета по платежам' });
  }
});

app.get('/api/reports/customers', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let whereCondition = {};
    
    if (startDate && endDate) {
      whereCondition.created_at = {
        [db.Sequelize.Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }
    
    const customers = await db.Customer.findAll({
      where: whereCondition,
      order: [['created_at', 'DESC']]
    });
    
    res.json(customers);
  } catch (err) {
    console.error('Ошибка получения отчета по клиентам:', err);
    res.status(500).json({ error: 'Ошибка при получении отчета по клиентам' });
  }
});

// Verification endpoints
app.get('/api/verifications', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status } = req.query;
    let whereCondition = {};
    
    if (status) {
      whereCondition.status = status;
    }
    
    const verifications = await db.Verification.findAll({
      where: whereCondition,
      order: [['submitted_at', 'DESC']],
      include: [{ model: db.User, as: 'user' }]
    });
    
    res.json(verifications);
  } catch (err) {
    console.error('Ошибка получения верификаций:', err);
    res.status(500).json({ error: 'Ошибка при получении верификаций' });
  }
});

app.get('/api/verifications/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const verification = await db.Verification.findByPk(id, {
      include: [{ model: db.User, as: 'user' }]
    });
    
    if (!verification) {
      return res.status(404).json({ error: 'Верификация не найдена' });
    }
    
    res.json(verification);
  } catch (err) {
    console.error('Ошибка получения верификации:', err);
    res.status(500).json({ error: 'Ошибка при получении верификации' });
  }
});

app.post('/api/verifications', authenticateToken, upload.array('documents', 3), async (req, res) => {
  try {
    const { type } = req.body;
    const documents = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];
    
    if (!type) {
      return res.status(400).json({ error: 'Тип верификации обязателен' });
    }
    
    const verification = await db.Verification.create({
      user_id: req.user.userId,
      type,
      status: 'pending',
      documents: documents.length > 0 ? documents : null,
      submitted_at: new Date()
    });
    
    res.status(201).json(verification);
  } catch (err) {
    console.error('Ошибка создания верификации:', err);
    res.status(500).json({ error: 'Ошибка при создании верификации' });
  }
});

app.put('/api/verifications/:id/approve', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const verification = await db.Verification.findByPk(id);
    if (!verification) {
      return res.status(404).json({ error: 'Верификация не найдена' });
    }
    
    const updatedVerification = await verification.update({ status: 'approved' });
    res.json(updatedVerification);
  } catch (err) {
    console.error('Ошибка одобрения верификации:', err);
    res.status(500).json({ error: 'Ошибка при одобрении верификации' });
  }
});

app.put('/api/verifications/:id/reject', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    
    const verification = await db.Verification.findByPk(id);
    if (!verification) {
      return res.status(404).json({ error: 'Верификация не найдена' });
    }
    
    const updatedVerification = await verification.update({ 
      status: 'rejected',
      rejection_reason: reason 
    });
    
    res.json(updatedVerification);
  } catch (err) {
    console.error('Ошибка отклонения верификации:', err);
    res.status(500).json({ error: 'Ошибка при отклонении верификации' });
  }
});

app.delete('/api/verifications/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const verification = await db.Verification.findByPk(id);
    if (!verification) {
      return res.status(404).json({ error: 'Верификация не найдена' });
    }
    
    await verification.destroy();
    res.json({ message: 'Верификация удалена' });
  } catch (err) {
    console.error('Ошибка удаления верификации:', err);
    res.status(500).json({ error: 'Ошибка при удалении верификации' });
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

  const { user_id, email, password, name, phone, role } = req.body;
  
  try {
    // Проверяем, существует ли пользователь с таким email
    const existingAuth = await db.Auth.findOne({ where: { email } });
    if (existingAuth) {
      return res.status(400).json({ error: 'Пользователь с таким email уже существует' });
    }
    
    // Проверяем, существует ли пользователь с таким user_id
    const existingUser = await db.User.findByPk(user_id);
    if (existingUser) {
      return res.status(400).json({ error: 'Пользователь с таким ID уже существует' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Создаем запись в таблице пользователей
    const user = await db.User.create({
      id: user_id,
      name: name || email.split('@')[0],
      email,
      phone: phone || null
    });
    
    // Создаем запись аутентификации
    const auth = await db.Auth.create({
      user_id,
      email,
      password: hashedPassword,
      role: role || 'user'
    });
    
    const token = jwt.sign(
      { userId: user_id, role: role || 'user' }, 
      process.env.JWT_SECRET || 'your_jwt_secret', 
      { expiresIn: '24h' }
    );
    
    res.status(201).json({ user, token });
  } catch (err) {
    console.error('Ошибка регистрации:', err);
    res.status(500).json({ error: 'Ошибка при регистрации пользователя' });
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
    
    const user = await db.User.findByPk(auth.user_id);
    if (!user) {
      return res.status(401).json({ error: 'Пользователь не найден' });
    }
    
    const token = jwt.sign(
      { userId: auth.user_id, role: auth.role }, 
      process.env.JWT_SECRET || 'your_jwt_secret', 
      { expiresIn: '24h' }
    );
    
    res.json({ user, token, role: auth.role });
  } catch (err) {
    console.error('Ошибка входа:', err);
    res.status(500).json({ error: 'Ошибка при входе в систему' });
  }
});

app.post('/api/auth/logout', authenticateToken, (req, res) => {
  // В JWT нет состояния, поэтому просто возвращаем успех
  res.json({ message: 'Выход выполнен' });
});

app.post('/api/auth/change-password', authenticateToken, [
  check('currentPassword').exists(),
  check('newPassword').isLength({ min: 6 }),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { currentPassword, newPassword } = req.body;
  
  try {
    const auth = await db.Auth.findOne({ where: { user_id: req.user.userId } });
    if (!auth) {
      return res.status(404).json({ error: 'Учетная запись не найдена' });
    }
    
    const isMatch = await bcrypt.compare(currentPassword, auth.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Текущий пароль неверен' });
    }
    
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await auth.update({ password: hashedPassword });
    
    res.json({ message: 'Пароль успешно изменен' });
  } catch (err) {
    console.error('Ошибка смены пароля:', err);
    res.status(500).json({ error: 'Ошибка при смене пароля' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'Файл слишком большой' });
    }
  }
  
  res.status(500).json({ error: 'Что-то пошло не так!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Эндпоинт не найден' });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});