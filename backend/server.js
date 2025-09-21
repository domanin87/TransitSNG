import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { Pool } from 'pg';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import cors from 'cors';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'transitsng',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
});

const authenticateToken = async (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const decoded = jwt.verify(token, 'secret');
    const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [decoded.userId]);
    if (!rows[0]) return res.status(401).json({ error: 'Invalid token' });
    req.user = rows[0];
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Auth routes
app.post('/api/auth/register', async (req, res) => {
  const { name, email, phone, password, userType } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const { rows } = await pool.query(
      'INSERT INTO users (name, email, phone, password, role, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, email, phone, hashedPassword, userType, 'pending']
    );
    const token = jwt.sign({ userId: rows[0].id }, 'secret', { expiresIn: '1h' });
    res.json({ user: rows[0], token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1 OR phone = $1', [email]);
    if (!rows[0]) return res.status(401).json({ error: 'User not found' });
    const isMatch = await bcrypt.compare(password, rows[0].password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ userId: rows[0].id }, 'secret', { expiresIn: '1h' });
    res.json({ user: rows[0], token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Users routes
app.get('/api/users', authenticateToken, async (req, res) => {
  if (req.user.role !== 'superadmin') return res.status(403).json({ error: 'Forbidden' });
  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE role != $1', ['superadmin']);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/users', authenticateToken, async (req, res) => {
  if (req.user.role !== 'superadmin') return res.status(403).json({ error: 'Forbidden' });
  const { name, email, phone, password, role, status } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const { rows } = await pool.query(
      'INSERT INTO users (name, email, phone, password, role, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, email, phone, hashedPassword, role, status]
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/users/:id', authenticateToken, async (req, res) => {
  if (req.user.role !== 'superadmin') return res.status(403).json({ error: 'Forbidden' });
  const { id } = req.params;
  const { name, email, phone, role, status } = req.body;
  try {
    const { rows } = await pool.query(
      'UPDATE users SET name = $1, email = $2, phone = $3, role = $4, status = $5 WHERE id = $6 RETURNING *',
      [name, email, phone, role, status, id]
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/users/:id', authenticateToken, async (req, res) => {
  if (req.user.role !== 'superadmin') return res.status(403).json({ error: 'Forbidden' });
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Drivers routes
app.get('/api/drivers', authenticateToken, async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM drivers');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/drivers', authenticateToken, async (req, res) => {
  if (req.user.role !== 'superadmin') return res.status(403).json({ error: 'Forbidden' });
  const { userId, license, vehicleType, status } = req.body;
  try {
    const { rows } = await pool.query(
      'INSERT INTO drivers (user_id, license, vehicle_type, status) VALUES ($1, $2, $3, $4) RETURNING *',
      [userId, license, vehicleType, status]
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/drivers/:id', authenticateToken, async (req, res) => {
  if (req.user.role !== 'superadmin') return res.status(403).json({ error: 'Forbidden' });
  const { id } = req.params;
  const { license, vehicleType, status } = req.body;
  try {
    const { rows } = await pool.query(
      'UPDATE drivers SET license = $1, vehicle_type = $2, status = $3 WHERE id = $4 RETURNING *',
      [license, vehicleType, status, id]
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/drivers/:id', authenticateToken, async (req, res) => {
  if (req.user.role !== 'superadmin') return res.status(403).json({ error: 'Forbidden' });
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM drivers WHERE id = $1', [id]);
    res.json({ message: 'Driver deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/drivers/:id/verify', authenticateToken, async (req, res) => {
  if (!['superadmin', 'admin', 'moderator'].includes(req.user.role)) return res.status(403).json({ error: 'Forbidden' });
  const { id } = req.params;
  try {
    await pool.query('UPDATE drivers SET status = $1 WHERE id = $2', ['active', id]);
    res.json({ message: 'Driver verified' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/drivers/:id/reject', authenticateToken, async (req, res) => {
  if (!['superadmin', 'admin', 'moderator'].includes(req.user.role)) return res.status(403).json({ error: 'Forbidden' });
  const { id } = req.params;
  try {
    await pool.query('UPDATE drivers SET status = $1 WHERE id = $2', ['blocked', id]);
    res.json({ message: 'Driver rejected' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Orders routes
app.get('/api/orders', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM orders');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/orders', authenticateToken, async (req, res) => {
  const { from_city, to_city, cargo_type, weight, price, status } = req.body;
  try {
    const { rows } = await pool.query(
      'INSERT INTO orders (from_city, to_city, cargo_type, weight, price, status, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [from_city, to_city, cargo_type, weight, price, status, req.user.id]
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/orders/:id', authenticateToken, async (req, res) => {
  if (!['superadmin', 'admin', 'moderator'].includes(req.user.role)) return res.status(403).json({ error: 'Forbidden' });
  const { id } = req.params;
  const { from_city, to_city, cargo_type, weight, price, status } = req.body;
  try {
    const { rows } = await pool.query(
      'UPDATE orders SET from_city = $1, to_city = $2, cargo_type = $3, weight = $4, price = $5, status = $6 WHERE id = $7 RETURNING *',
      [from_city, to_city, cargo_type, weight, price, status, id]
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/orders/:id', authenticateToken, async (req, res) => {
  if (!['superadmin', 'admin', 'moderator'].includes(req.user.role)) return res.status(403).json({ error: 'Forbidden' });
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM orders WHERE id = $1', [id]);
    res.json({ message: 'Order deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Payments routes
app.get('/api/payments', authenticateToken, async (req, res) => {
  if (!['superadmin', 'admin', 'moderator'].includes(req.user.role)) return res.status(403).json({ error: 'Forbidden' });
  try {
    const { rows } = await pool.query('SELECT * FROM payments');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/payments', authenticateToken, async (req, res) => {
  if (!['superadmin', 'admin', 'moderator'].includes(req.user.role)) return res.status(403).json({ error: 'Forbidden' });
  const { order_id, amount, method, status } = req.body;
  try {
    const { rows } = await pool.query(
      'INSERT INTO payments (order_id, amount, method, status) VALUES ($1, $2, $3, $4) RETURNING *',
      [order_id, amount, method, status]
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/payments/:id', authenticateToken, async (req, res) => {
  if (!['superadmin', 'admin', 'moderator'].includes(req.user.role)) return res.status(403).json({ error: 'Forbidden' });
  const { id } = req.params;
  const { amount, method, status } = req.body;
  try {
    const { rows } = await pool.query(
      'UPDATE payments SET amount = $1, method = $2, status = $3 WHERE id = $4 RETURNING *',
      [amount, method, status, id]
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/payments/:id', authenticateToken, async (req, res) => {
  if (!['superadmin', 'admin', 'moderator'].includes(req.user.role)) return res.status(403).json({ error: 'Forbidden' });
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM payments WHERE id = $1', [id]);
    res.json({ message: 'Payment deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Tariffs routes
app.get('/api/tariffs', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM tariffs');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/tariffs', authenticateToken, async (req, res) => {
  if (!['superadmin', 'admin'].includes(req.user.role)) return res.status(403).json({ error: 'Forbidden' });
  const { from_city, to_city, price_per_km, min_price } = req.body;
  try {
    const { rows } = await pool.query(
      'INSERT INTO tariffs (from_city, to_city, price_per_km, min_price) VALUES ($1, $2, $3, $4) RETURNING *',
      [from_city, to_city, price_per_km, min_price]
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/tariffs/:id', authenticateToken, async (req, res) => {
  if (!['superadmin', 'admin'].includes(req.user.role)) return res.status(403).json({ error: 'Forbidden' });
  const { id } = req.params;
  const { from_city, to_city, price_per_km, min_price } = req.body;
  try {
    const { rows } = await pool.query(
      'UPDATE tariffs SET from_city = $1, to_city = $2, price_per_km = $3, min_price = $4 WHERE id = $5 RETURNING *',
      [from_city, to_city, price_per_km, min_price, id]
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/tariffs/:id', authenticateToken, async (req, res) => {
  if (!['superadmin', 'admin'].includes(req.user.role)) return res.status(403).json({ error: 'Forbidden' });
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM tariffs WHERE id = $1', [id]);
    res.json({ message: 'Tariff deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Verifications routes
app.get('/api/verifications', authenticateToken, async (req, res) => {
  if (!['superadmin', 'admin', 'moderator'].includes(req.user.role)) return res.status(403).json({ error: 'Forbidden' });
  try {
    const { rows } = await pool.query('SELECT * FROM verifications');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/verifications/:id/approve', authenticateToken, async (req, res) => {
  if (!['superadmin', 'admin', 'moderator'].includes(req.user.role)) return res.status(403).json({ error: 'Forbidden' });
  const { id } = req.params;
  try {
    await pool.query('UPDATE verifications SET status = $1 WHERE id = $2', ['approved', id]);
    res.json({ message: 'Verification approved' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/verifications/:id/reject', authenticateToken, async (req, res) => {
  if (!['superadmin', 'admin', 'moderator'].includes(req.user.role)) return res.status(403).json({ error: 'Forbidden' });
  const { id } = req.params;
  try {
    await pool.query('UPDATE verifications SET status = $1 WHERE id = $2', ['rejected', id]);
    res.json({ message: 'Verification rejected' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Settings routes
app.get('/api/settings', authenticateToken, async (req, res) => {
  if (req.user.role !== 'superadmin') return res.status(403).json({ error: 'Forbidden' });
  try {
    const { rows } = await pool.query('SELECT * FROM settings WHERE id = 1');
    res.json(rows[0] || { site_name: 'TransitSNG', contact_email: 'support@transitsng.com', maintenance_mode: false });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/settings', authenticateToken, async (req, res) => {
  if (req.user.role !== 'superadmin') return res.status(403).json({ error: 'Forbidden' });
  const { siteName, contactEmail, maintenanceMode } = req.body;
  try {
    const { rows } = await pool.query(
      'INSERT INTO settings (id, site_name, contact_email, maintenance_mode) VALUES (1, $1, $2, $3) ON CONFLICT (id) UPDATE SET site_name = $1, contact_email = $2, maintenance_mode = $3 RETURNING *',
      [siteName, contactEmail, maintenanceMode]
    );
    res.json(rows[0]);
  } catch (err