// backend/routes/transport.js
const express = require('express');
const router = express.Router();
const db = require('../models');
const { Op } = require('sequelize');
const { Transport } = db;

// Add transport
router.post('/', async (req, res, next) => {
    try {
        const t = await Transport.create(req.body);
        res.json({ status: 'ok', transport: t });
    } catch (err) { next(err); }
});

// Search transport
router.get('/search', async (req, res, next) => {
    try {
        const { from, to, capacityMin, page=1, limit=20 } = req.query;
        const where = {};
        if (from) where.fromCity = { [Op.iLike]: `%${from}%` };
        if (to) where.toCity = { [Op.iLike]: `%${to}%` };
        if (capacityMin) where.capacity = { [Op.gte]: parseFloat(capacityMin) };
        const items = await Transport.findAll({ where, limit: parseInt(limit), offset: (page-1)*limit });
        res.json({ count: items.length, items });
    } catch (err) { next(err); }
});

module.exports = router;
