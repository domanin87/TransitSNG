// backend/routes/admin.js
// Admin routes: edit users/drivers/admins (except superadmin), manage orders (archive/restore/assign),
// payments summarization, tariffs management, news and vacancies CRUD.
const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
// Adjust these model imports to match your models/index.js exports
const db = require('../models'); // assumes backend/models/index.js exports sequelize models
const { User, Order, Payment, Tariff, News, Vacancy } = db;

// Middleware placeholder: replace with your auth middleware
function requireAdmin(req, res, next) {
    if (!req.user || !req.user.isAdmin) {
        return res.status(403).json({ error: 'admin required' });
    }
    next();
}

// Prevent non-superadmin from editing superadmin
function preventSuperEdit(req, res, next) {
    const targetId = parseInt(req.params.userId,10);
    if (!targetId) return next();
    User.findByPk(targetId).then(u => {
        if (!u) return res.status(404).json({ error: 'user not found' });
        if (u.isSuperAdmin && !(req.user && req.user.isSuperAdmin)) {
            return res.status(403).json({ error: 'cannot edit superadmin' });
        }
        req.targetUser = u;
        next();
    }).catch(next);
}

// Edit user (GET/PUT/DELETE)
router.get('/users/:userId', requireAdmin, async (req, res, next) => {
    try {
        const u = await User.findByPk(req.params.userId);
        if (!u) return res.status(404).json({ error: 'not found' });
        res.json(u);
    } catch (err) { next(err); }
});

router.put('/users/:userId', requireAdmin, preventSuperEdit, async (req, res, next) => {
    try {
        const fields = ['name','email','phone','role','isAdmin','isDriver','isActive'];
        const updates = {};
        for (const f of fields) if (req.body[f] !== undefined) updates[f]=req.body[f];
        await req.targetUser.update(updates);
        res.json({ status: 'ok', user: req.targetUser });
    } catch (err) { next(err); }
});

router.delete('/users/:userId', requireAdmin, preventSuperEdit, async (req, res, next) => {
    try {
        // soft delete
        await req.targetUser.update({ isActive: false });
        res.json({ status: 'archived' });
    } catch (err) { next(err); }
});

// Orders actions
router.post('/orders/:orderId/action', requireAdmin, async (req, res, next) => {
    try {
        const order = await Order.findByPk(req.params.orderId);
        if (!order) return res.status(404).json({ error: 'order not found' });
        const action = req.body.action;
        if (action === 'archive') {
            await order.update({ archived: true });
        } else if (action === 'restore') {
            await order.update({ archived: false });
        } else if (action === 'assign') {
            const driverId = req.body.driverId;
            await order.update({ driverId });
        } else {
            return res.status(400).json({ error: 'unknown action' });
        }
        res.json({ status: 'ok', order });
    } catch (err) { next(err); }
});

// Payments summarize: accept items as [{id, amount}] or ids array
router.post('/payments/summarize', requireAdmin, async (req, res, next) => {
    try {
        let items = req.body.items;
        if (!items && req.body.ids) {
            const ids = req.body.ids;
            items = await Payment.findAll({ where: { id: ids }});
        }
        let total = 0;
        let breakdown = [];
        if (Array.isArray(items)) {
            for (const it of items) {
                const amt = parseFloat(it.amount || it);
                total += amt || 0;
                breakdown.push({ id: it.id || null, amount: amt || 0 });
            }
        }
        res.json({ total, breakdown, count: breakdown.length });
    } catch (err) { next(err); }
});

// Tariffs: CRUD + filter by starts_with letter
router.get('/tariffs', requireAdmin, async (req, res, next) => {
    try {
        const starts = req.query.starts_with;
        const where = {};
        if (starts) where.city = { [Op.iLike]: `${starts}%` };
        const list = await Tariff.findAll({ where });
        res.json(list);
    } catch (err) { next(err); }
});

router.post('/tariffs', requireAdmin, async (req, res, next) => {
    try {
        const t = await Tariff.create(req.body);
        res.json(t);
    } catch (err) { next(err); }
});

router.put('/tariffs/:id', requireAdmin, async (req, res, next) => {
    try {
        const t = await Tariff.findByPk(req.params.id);
        if (!t) return res.status(404).json({ error: 'not found' });
        await t.update(req.body);
        res.json(t);
    } catch (err) { next(err); }
});

router.delete('/tariffs/:id', requireAdmin, async (req, res, next) => {
    try {
        const t = await Tariff.findByPk(req.params.id);
        if (!t) return res.status(404).json({ error: 'not found' });
        await t.destroy();
        res.json({ status: 'deleted' });
    } catch (err) { next(err); }
});

// News & Vacancies CRUD
router.get('/news', requireAdmin, async (req, res, next) => {
    const list = await News.findAll();
    res.json(list);
});
router.post('/news', requireAdmin, async (req, res, next) => {
    const n = await News.create(req.body);
    res.json(n);
});
router.put('/news/:id', requireAdmin, async (req, res, next) => {
    const n = await News.findByPk(req.params.id);
    if (!n) return res.status(404).json({ error: 'not found' });
    await n.update(req.body);
    res.json(n);
});
router.delete('/news/:id', requireAdmin, async (req, res, next) => {
    const n = await News.findByPk(req.params.id);
    if (!n) return res.status(404).json({ error: 'not found' });
    await n.destroy();
    res.json({ status: 'deleted' });
});

router.get('/vacancies', requireAdmin, async (req, res, next) => {
    const list = await Vacancy.findAll();
    res.json(list);
});
router.post('/vacancies', requireAdmin, async (req, res, next) => {
    const v = await Vacancy.create(req.body);
    res.json(v);
});
router.put('/vacancies/:id', requireAdmin, async (req, res, next) => {
    const v = await Vacancy.findByPk(req.params.id);
    if (!v) return res.status(404).json({ error: 'not found' });
    await v.update(req.body);
    res.json(v);
});
router.delete('/vacancies/:id', requireAdmin, async (req, res, next) => {
    const v = await Vacancy.findByPk(req.params.id);
    if (!v) return res.status(404).json({ error: 'not found' });
    await v.destroy();
    res.json({ status: 'deleted' });
});

module.exports = router;
