
const router = require('express').Router();
const { Cargo } = require('../models');
const logger = require('../logger');

router.post('/create', async (req,res)=>{
  try{
    const p = req.body;
    const c = await Cargo.create({
      title: p.title||'title',
      description: p.description||null,
      origin_country: p.origin_country||null,
      origin_city: p.origin_city||null,
      dest_country: p.dest_country||null,
      dest_city: p.dest_city||null,
      weight: p.weight||0,
      price: p.price||0,
      currency: p.currency||process.env.BASE_CURRENCY||'KZT',
      user_id: p.user_id||null,
      status: 'published'
    });
    res.status(201).json({ success:true, cargo:c });
  }catch(e){ logger.error('create cargo failed', e); res.status(500).json({ error:'create_failed' }); }
});

router.get('/list', async (req,res)=>{
  try{
    const where = {};
    if(req.query.from) where.origin_country = req.query.from;
    if(req.query.to) where.dest_country = req.query.to;
    const list = await Cargo.findAll({ where, order:[['created_at','DESC']] });
    res.json(list.map(c=>({ id:c.id, title:c.title, origin:c.origin_city||c.origin_country, dest:c.dest_city||c.dest_country, price:c.price, currency:c.currency, status:c.status, map_enabled:c.map_enabled })));
  }catch(e){ logger.error('list cargos failed', e); res.status(500).json({ error:'list_failed' }); }
});

// toggle map_enabled (admin or after payment)
router.post('/:id/map_enable', async (req,res)=>{
  try{
    const id = req.params.id;
    const c = await Cargo.findByPk(id);
    if(!c) return res.status(404).json({ error:'not_found' });
    c.map_enabled = !!req.body.enabled;
    await c.save();
    res.json({ cargo: c });
  }catch(e){ logger.error('toggle map failed', e); res.status(500).json({ error:'toggle_failed' }); }
});

module.exports = router;
