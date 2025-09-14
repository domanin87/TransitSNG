
const router = require('express').Router();
const { DriverLocation } = require('../models');
const logger = require('../logger');

router.post('/location', async (req,res)=>{
  try{
    const { driverId, cargoId, lat, lon, speed } = req.body;
    const rec = await DriverLocation.create({ driver_id: driverId, cargo_id: cargoId, lat, lon, speed });
    // emit via socket.io to rooms
    try{ const io = req.app.get('io'); if(io){ if(cargoId) io.to('cargo_'+cargoId).emit('location_update', rec); io.to('driver_'+driverId).emit('location_update', rec); } }catch(e){}
    res.json({ ok:true, rec });
  }catch(e){ logger.error('track location failed', e); res.status(500).json({ error:'track_failed' }); }
});

router.get('/driver/:id', async (req,res)=>{
  try{
    const id = req.params.id;
    const recs = await DriverLocation.findAll({ where:{ driver_id: id }, order:[['timestamp','DESC']], limit:50 });
    res.json(recs);
  }catch(e){ logger.error('driver history failed', e); res.status(500).json({ error:'history_failed' }); }
});

module.exports = router;
