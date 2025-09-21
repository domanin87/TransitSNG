// backend/routes/cargos.js
const express = require('express');
const router = express.Router();
const db = require('../models');
const { Op } = require('sequelize');
const { Cargo } = db;

// Create cargo (from della.kz feature 'add cargo')
router.post('/', async (req, res, next) => {
    try {
        const payload = req.body;
        // expected fields: fromCity, toCity, weight, volume, type, price, description, loadingDate
        const c = await Cargo.create(payload);
        res.json({ status: 'ok', cargo: c });
    } catch (err) { next(err); }
});

// Search cargos with filters similar to della.kz
router.get('/search', async (req, res, next) => {
    try {
        const { from, to, minWeight, maxWeight, type, page=1, limit=20 } = req.query;
        const where = {};
        if (from) where.fromCity = { [Op.iLike]: `%${from}%` };
        if (to) where.toCity = { [Op.iLike]: `%${to}%` };
        if (type) where.type = type;
        if (minWeight) where.weight = { [Op.gte]: parseFloat(minWeight) };
        if (maxWeight) {
            where.weight = where.weight || {};
            where.weight[Op.lte] = parseFloat(maxWeight);
        }
        const cargos = await Cargo.findAll({ where, limit: parseInt(limit), offset: (page-1)*limit, order: [['createdAt','DESC']]});
        res.json({ count: cargos.length, cargos });
    } catch (err) { next(err); }
});

// Get single cargo
router.get('/:id', async (req,res,next)=>{
    try {
        const c = await Cargo.findByPk(req.params.id);
        if (!c) return res.status(404).json({error:'not found'});
        res.json(c);
    } catch (err) { next(err); }
});

module.exports = router;
