const db = require('../models');
const Cargo = db.Cargo;
const { Op } = db.Sequelize;

async function listCargos(req, res){
  const q = req.query.q;
  const where = { status: 'published' };
  if(q){
    where[Op.or] = [
      { title: { [Op.iLike]: `%${q}%` } },
      { from_city: { [Op.iLike]: `%${q}%` } },
      { to_city: { [Op.iLike]: `%${q}%` } }
    ];
  }
  const items = await Cargo.findAll({ where, limit: 50, order: [['published_at','DESC']] });
  res.json(items);
}

async function getCargo(req, res){
  const c = await Cargo.findByPk(req.params.id);
  if(!c) return res.status(404).json({error:'not found'});
  res.json(c);
}

async function createCargo(req, res){
  const data = req.body;
  // minimal validation
  if(!data.title) return res.status(400).json({error:'title required'});
  data.user_id = req.user && req.user.sub;
  data.published_at = new Date();
  const c = await Cargo.create(data);
  res.json(c);
}

async function updateCargo(req, res){
  const c = await Cargo.findByPk(req.params.id);
  if(!c) return res.status(404).json({error:'not found'});
  Object.assign(c, req.body); await c.save(); res.json(c);
}

async function deleteCargo(req, res){
  const c = await Cargo.findByPk(req.params.id);
  if(!c) return res.status(404).json({error:'not found'});
  await c.destroy(); res.json({ok:true});
}

module.exports = { listCargos, getCargo, createCargo, updateCargo, deleteCargo };

// Distance-based estimate endpoint
const distService = require('../services/distance');
async function estimate(req, res){
  try{
    const { fromCoords, toCoords, tariffId } = req.body || {};
    if(!fromCoords || !toCoords) return res.status(400).json({ error: 'fromCoords and toCoords required' });
    const d = await distService.calculateDistance(fromCoords, toCoords);
    // fetch tariff if provided
    let perUnit = 1000; // default
    if(tariffId){
      const db = require('../models'); const Tariff = db.Tariff;
      const t = await Tariff.findByPk(tariffId);
      if(t) perUnit = parseFloat(t.price || perUnit);
    }
    const price = perUnit * (d.km/100.0); // simple formula
    res.json({ km: d.km, source: d.source, price });
  }catch(e){ console.log(e); res.status(500).json({ error: e.message }); }
}
module.exports.estimate = estimate;
