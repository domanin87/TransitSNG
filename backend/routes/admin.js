const express = require('express');
const User = require('../models/User');
const Cargo = require('../models/Cargo');
const Transaction = require('../models/Transaction');
const Tariff = require('../models/Tariff');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Admin middleware
const adminMiddleware = (req, res, next) => {
  if (req.userRole !== 'admin' && req.userRole !== 'superadmin' && req.userRole !== 'moderator') {
    return res.status(403).json({ error: 'Access denied. Admin required.' });
  }
  next();
};

// Get dashboard statistics
router.get('/dashboard', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const [
      totalUsers,
      totalDrivers,
      totalCargos,
      pendingCargos,
      totalTransactions,
      revenue
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'driver' }),
      Cargo.countDocuments(),
      Cargo.countDocuments({ status: 'moderation' }),
      Transaction.countDocuments({ status: 'completed' }),
      Transaction.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ])
    ]);

    res.json({
      statistics: {
        totalUsers,
        totalDrivers,
        totalCargos,
        pendingCargos,
        totalTransactions,
        revenue: revenue[0]?.total || 0
      }
    });
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get users with pagination and filters
router.get('/users', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 10, role, search } = req.query;
    const filter = {};

    if (role) filter.role = role;
    if (search) {
      filter.$or = [
        { name: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') },
        { phone: new RegExp(search, 'i') }
      ];
    }

    const users = await User.find(filter)
      .select('-password -verification')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(filter);

    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user status
router.put('/users/:userId/status', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { status } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { isActive: status },
      { new: true }
    ).select('-password -verification');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User status updated successfully', user });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Moderate cargo
router.put('/cargos/:cargoId/moderate', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const updateData = { status };
    if (status === 'rejected' && rejectionReason) {
      updateData.rejectionReason = rejectionReason;
    }

    const cargo = await Cargo.findByIdAndUpdate(
      req.params.cargoId,
      updateData,
      { new: true }
    )
    .populate('createdBy', 'name email phone')
    .populate('assignedTo.driver', 'name phone');

    if (!cargo) {
      return res.status(404).json({ error: 'Cargo not found' });
    }

    res.json({ message: `Cargo ${status} successfully`, cargo });
  } catch (error) {
    console.error('Moderate cargo error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all transactions
router.get('/transactions', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 10, type, status } = req.query;
    const filter = {};

    if (type) filter.type = type;
    if (status) filter.status = status;

    const transactions = await Transaction.find(filter)
      .populate('user', 'name email')
      .populate('relatedEntity.id')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Transaction.countDocuments(filter);

    res.json({
      transactions,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;