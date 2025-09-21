const express = require('express');
const router = express.Router();
const { User, Order, Payment, Tariff, News, Vacancy } = require('../models'); // assumes Sequelize models export
const { Op } = require('sequelize');

// middleware: check superadmin (very simple - assume req.user.is_superadmin exists)
// In production replace with real auth middleware
function requireSuperAdmin(req, res, next) {
  if (req.user && req.user.is_superadmin) return next();
  return res.status(403).json({ error: 'Only superadmin allowed' });
}
function requireAdminOrSuper(req, res, next) {
  if (req.user && (req.user.is_admin || req.user.is_superadmin)) return next();
  return res.status(403).json({ error: 'Admin required' });
}

// USERS: list, get, update, delete (can't modify superadmin except by superadmin)
router.get('/users', requireAdminOrSuper, async (req, res) => {
  const users = await User.findAll();
  res.json(users);
});
router.get('/users/:id', requireAdminOrSuper, async (req,res)=>{
  const u = await User.findByPk(req.params.id);
  if(!u) return res.status(404).json({error:'not found'});
  res.json(u);
});
router.put('/users/:id', requireAdminOrSuper, async (req,res)=>{
  const u = await User.findByPk(req.params.id);
  if(!u) return res.status(404).json({error:'not found'});
  // prevent non-super from editing superadmin
  if(u.is_superadmin && !(req.user && req.user.is_superadmin)) return res.status(403).json({error:'cannot modify superadmin'});
  const allowed = ['name','email','phone','is_active','is_driver','is_admin','role'];
  allowed.forEach(k=>{ if(req.body[k]!==undefined) u[k]=req.body[k]; });
  await u.save();
  res.json(u);
});
router.delete('/users/:id', requireAdminOrSuper, async (req,res)=>{
  const u = await User.findByPk(req.params.id);
  if(!u) return res.status(404).json({error:'not found'});
  if(u.is_superadmin) return res.status(403).json({error:'cannot delete superadmin'});
  await u.destroy();
  res.json({ok:true});
});

// ORDERS actions: list, assign driver, archive, change status, bulk select
router.get('/orders', requireAdminOrSuper, async (req,res)=>{
  const where = {};
  if(req.query.archived) where.archived = req.query.archived === 'true';
  const orders = await Order.findAll({ where });
  res.json(orders);
});
router.post('/orders/:id/assign', requireAdminOrSuper, async (req,res)=>{
  const o = await Order.findByPk(req.params.id);
  if(!o) return res.status(404).json({error:'not found'});
  o.driver_id = req.body.driver_id;
  await o.save();
  res.json(o);
});
router.post('/orders/:id/archive', requireAdminOrSuper, async (req,res)=>{
  const o = await Order.findByPk(req.params.id);
  if(!o) return res.status(404).json({error:'not found'});
  o.archived = true;
  await o.save();
  res.json(o);
});
router.post('/orders/bulk', requireAdminOrSuper, async (req,res)=>{
  // req.body.ids = [1,2,3], action = 'archive'|'restore'
  const ids = req.body.ids || [];
  const action = req.body.action;
  if(!Array.isArray(ids)) return res.status(400).json({error:'ids array required'});
  const orders = await Order.findAll({ where: { id: { [Op.in]: ids } } });
  for(const o of orders){
    if(action === 'archive') o.archived = true;
    else if(action === 'restore') o.archived = false;
    await o.save();
  }
  res.json({ok:true, count: orders.length});
});

// PAYMENTS: list items, sum selected
router.get('/payments', requireAdminOrSuper, async (req,res)=>{
  const payments = await Payment.findAll();
  res.json(payments);
});
router.post('/payments/sum', requireAdminOrSuper, async (req,res)=>{
  const ids = req.body.ids || [];
  if(!Array.isArray(ids)) return res.status(400).json({error:'ids array required'});
  const items = await Payment.findAll({ where: { id: { [Op.in]: ids } } });
  const total = items.reduce((s,i)=> s + parseFloat(i.amount || 0), 0);
  res.json({total, count: items.length});
});

// TARIFFS: CRUD, group by starting letter, apply on home (flag)
router.get('/tariffs', requireAdminOrSuper, async (req,res)=>{
  const start_with = req.query.start_with;
  const where = {};
  if(start_with) where.city = { [Op.iLike]: `${start_with}%` };
  const tariffs = await Tariff.findAll({ where });
  res.json(tariffs);
});
router.post('/tariffs', requireAdminOrSuper, async (req,res)=>{
  const t = await Tariff.create(req.body);
  res.json(t);
});
router.put('/tariffs/:id', requireAdminOrSuper, async (req,res)=>{
  const t = await Tariff.findByPk(req.params.id);
  if(!t) return res.status(404).json({error:'not found'});
  Object.assign(t, req.body); await t.save(); res.json(t);
});
router.delete('/tariffs/:id', requireAdminOrSuper, async (req,res)=>{
  const t = await Tariff.findByPk(req.params.id);
  if(!t) return res.status(404).json({error:'not found'});
  await t.destroy(); res.json({ok:true});
});

// NEWS & VACANCIES: CRUD minimal
router.get('/news', requireAdminOrSuper, async (req,res)=>{ res.json(await News.findAll()); });
router.post('/news', requireAdminOrSuper, async (req,res)=>{ res.json(await News.create(req.body)); });
router.put('/news/:id', requireAdminOrSuper, async (req,res)=>{ const n = await News.findByPk(req.params.id); Object.assign(n, req.body); await n.save(); res.json(n); });
router.delete('/news/:id', requireAdminOrSuper, async (req,res)=>{ const n = await News.findByPk(req.params.id); await n.destroy(); res.json({ok:true}); });

router.get('/vacancies', requireAdminOrSuper, async (req,res)=>{ res.json(await Vacancy.findAll()); });
router.post('/vacancies', requireAdminOrSuper, async (req,res)=>{ res.json(await Vacancy.create(req.body)); });
router.put('/vacancies/:id', requireAdminOrSuper, async (req,res)=>{ const v = await Vacancy.findByPk(req.params.id); Object.assign(v, req.body); await v.save(); res.json(v); });
router.delete('/vacancies/:id', requireAdminOrSuper, async (req,res)=>{ const v = await Vacancy.findByPk(req.params.id); await v.destroy(); res.json({ok:true}); });

module.exports = router;
