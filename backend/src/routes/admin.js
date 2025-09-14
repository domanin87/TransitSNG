
const router = require('express').Router();
const { User, Cargo, Tariff } = require('../models');
const logger = require('../logger');

// promote user to moderator/admin (simple)
router.post('/user/promote', async (req,res)=>{
  try{
    const { id, role } = req.body;
    const u = await User.findByPk(id);
    if(!u) return res.status(404).json({ error:'not_found' });
    u.role = role;
    await u.save();
    res.json({ user: u });
  }catch(e){ logger.error('promote failed', e); res.status(500).json({ error:'promote_failed' }); }
});

// list all users (admin)
router.get('/users', async (req,res)=>{
  try{ const users = await User.findAll(); res.json(users); }catch(e){ logger.error('users failed', e); res.status(500).json({ error:'users_failed' }); }
});

module.exports = router;
