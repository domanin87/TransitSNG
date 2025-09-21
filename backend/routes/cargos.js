const express = require('express');
const { body, validationResult } = require('express-validator');
const Cargo = require('../models/Cargo');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      from,
      to,
      type,
      minWeight,
      maxWeight,
      minPrice,
      maxPrice,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const filter = {};

    if (status) filter.status = status;
    if (from) filter['from.city'] = new RegExp(from, 'i');
    if (to) filter['to.city'] = new RegExp(to, 'i');
    if (type) filter.cargoType = type;
    if (minWeight || maxWeight) {
      filter.weight = {};
      if (minWeight) filter.weight.$gte = parseInt(minWeight);
      if (maxWeight) filter.weight.$lte = parseInt(maxWeight);
    }
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseInt(minPrice);
      if (maxPrice) filter.price.$lte = parseInt(maxPrice);
    }

    if (req.userRole !== 'admin' && req.userRole !== 'moderator') {
      filter.$or = [
        { status: 'approved' },
        { status: 'active' },
        { status: 'in_transit' },
        { createdBy: req.userId }
      ];
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const cargos = await Cargo.find(filter)
      .populate('createdBy', 'name email phone avatar')
      .populate('assignedTo.driver', 'name phone avatar driverProfile')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Cargo.countDocuments(filter);

    res.json({
      cargos,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get cargos error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const cargo = await Cargo.findById(req.params.id)
      .populate('createdBy', 'name email phone avatar company')
      .populate('assignedTo.driver', 'name phone avatar driverProfile')
      .populate('bids.driver', 'name phone avatar driverProfile');

    if (!cargo) {
      return res.status(404).json({ error: 'Cargo not found' });
    }

    if (req.userRole !== 'admin' && req.userRole !== 'moderator' && 
        cargo.createdBy._id.toString() !== req.userId && 
        cargo.status !== 'approved' && cargo.status !== 'active' && cargo.status !== 'in_transit') {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ cargo });
  } catch (error) {
    console.error('Get cargo error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', authMiddleware, [
  body('title').notEmpty().withMessage('Title is required'),
  body('from.city').notEmpty().withMessage('From city is required'),
  body('to.city').notEmpty().withMessage('To city is required'),
  body('weight').isNumeric().withMessage('Weight must be a number'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('distance').isNumeric().withMessage('Distance must be a number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const cargoData = {
      ...req.body,
      createdBy: req.userId,
      status: 'moderation'
    };

    const cargo = new Cargo(cargoData);
    await cargo.save();
    await cargo.populate('createdBy', 'name email phone avatar');

    res.status(201).json({
      message: 'Cargo created successfully and sent for moderation',
      cargo
    });
  } catch (error) {
    console.error('Create cargo error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const cargo = await Cargo.findById(req.params.id);

    if (!cargo) {
      return res.status(404).json({ error: 'Cargo not found' });
    }

    if (cargo.createdBy.toString() !== req.userId && req.userRole !== 'admin' && req.userRole !== 'moderator') {
      return res.status(403).json({ error: 'Access denied' });
    }

    Object.assign(cargo, req.body);
    await cargo.save();
    await cargo.populate('createdBy', 'name email phone avatar');
    await cargo.populate('assignedTo.driver', 'name phone avatar driverProfile');

    res.json({
      message: 'Cargo updated successfully',
      cargo
    });
  } catch (error) {
    console.error('Update cargo error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const cargo = await Cargo.findById(req.params.id);

    if (!cargo) {
      return res.status(404).json({ error: 'Cargo not found' });
    }

    if (cargo.createdBy.toString() !== req.userId && req.userRole !== 'admin' && req.userRole !== 'moderator') {
      return res.status(403).json({ error: 'Access denied' });
    }

    await Cargo.findByIdAndDelete(req.params.id);

    res.json({ message: 'Cargo deleted successfully' });
  } catch (error) {
    console.error('Delete cargo error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;