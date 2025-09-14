
const router = require('express').Router();
const { Message } = require('../models');
const logger = require('../logger');

router.post('/send', async (req,res)=>{
  try{
    const { from_user_id, to_user_id, cargo_id, text } = req.body;
    const m = await Message.create({ from_user_id, to_user_id, cargo_id, text });
    try{ const io = req.app.get('io'); if(io){ io.to(`cargo_${cargo_id||'all'}`).emit('message', m); } }catch(e){}
    res.json({ message: m });
  }catch(e){ logger.error('chat send failed', e); res.status(500).json({ error:'send_failed' }); }
});

router.get('/history', async (req,res)=>{
  try{
    const { cargo_id } = req.query;
    const where = {};
    if(cargo_id) where.cargo_id = cargo_id;
    const list = await Message.findAll({ where, order:[['created_at','ASC']] });
    res.json(list);
  }catch(e){ logger.error('chat history failed', e); res.status(500).json({ error:'history_failed' }); }
});

module.exports = router;
