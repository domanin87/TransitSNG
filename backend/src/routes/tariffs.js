
const router = require('express').Router();
const { Tariff } = require('../models');
const axios = require('axios');
const logger = require('../logger');
const BASE = process.env.BASE_CURRENCY || 'KZT';

router.post('/create', async (req,res)=>{
  try{
    const t = await Tariff.create(req.body);
    res.json({ tariff: t });
  }catch(e){ logger.error('tariff create failed', e); res.status(500).json({ error:'create_failed' }); }
});

router.get('/list', async (req,res)=>{
  try{
    const list = await Tariff.findAll();
    res.json(list);
  }catch(e){ logger.error('tariff list failed', e); res.status(500).json({ error:'list_failed' }); }
});

router.post('/quote', async (req,res)=>{
  try{
    const { weight=1, to } = req.body;
    const basePrice = 1000 * Number(weight);
    const base = { amount: Math.round(basePrice*100)/100, currency: BASE };
    let user = null;
    if(to && to !== BASE){
      const url = `${process.env.CURRENCY_API_URL || 'https://api.exchangerate.host/latest'}?base=${BASE}&symbols=${to}`;
      const r = await axios.get(url);
      const rate = r.data?.rates?.[to] || null;
      if(rate) user = { amount: Math.round(base.amount * rate * 100)/100, currency: to };
    }
    res.json({ base, user });
  }catch(e){ logger.error('quote failed', e); res.status(500).json({ error:'quote_failed' }); }
});

module.exports = router;
