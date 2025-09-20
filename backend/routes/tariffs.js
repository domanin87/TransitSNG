const express = require('express');
const { body, validationResult } = require('express-validator');
const Tariff = require('../models/Tariff');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { type, active } = req.query;
    const filter = {};

    if (type) filter.type = type;
    if (active !== undefined) filter.isActive = active === 'true';

    const tariffs = await Tariff.find(filter)
      .sort({ position: 1, createdAt: -1 });

    res.json({ tariffs });
  } catch (error) {
    console.error('Get tariffs error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const tariff = await Tariff.findById(req.params.id);

    if (!tariff) {
      return res.status(404).json({ error: 'Tariff not found' });
    }

    res.json({ tariff });
  } catch (error) {
    console.error('Get tariff error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', authMiddleware, [
  body('name').notEmpty().withMessage('Name is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('type').isIn(['individual', 'business', 'driver']).withMessage('Invalid type'),
  body('level').isIn(['basic', 'standard', 'pro', 'enterprise']).withMessage('Invalid level')
], async (req, res) => {
  try {
    if (req.userRole !== 'admin' && req.userRole !== 'superadmin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const tariffData = {
      ...req.body,
      createdBy: req.userId
    };

    const tariff = new Tariff(tariffData);
    await tariff.save();

    res.status(201).json({
      message: 'Tariff created successfully',
      tariff
    });
  } catch (error) {
    console.error('Create tariff error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    if (req.userRole !== 'admin' && req.userRole !== 'superadmin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const tariff = await Tariff.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!tariff) {
      return res.status(404).json({ error: 'Tariff not found' });
    }

    res.json({
      message: 'Tariff updated successfully',
      tariff
    });
  } catch (error) {
    console.error('Update tariff error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    if (req.userRole !== 'admin' && req.userRole !== 'superadmin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const tariff = await Tariff.findByIdAndDelete(req.params.id);

    if (!tariff) {
      return res.status(404).json({ error: 'Tariff not found' });
    }

    res.json({ message: 'Tariff deleted successfully' });
  } catch (error) {
    console.error('Delete tariff error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;