const db = require('../models');
const Transport = db.Transport;
const { Op } = db.Sequelize;

async function listTransports(req, res){
  const q = req.query.q;
  const where = { status: 'available' };
  if(q){
    where[Op.or] = [
      { title: { [Op.iLike]: `%${q}%` } },
      { city: { [Op.iLike]: `%${q}%` } }
    ];
  }
  const items = await Transport.findAll({ where, limit: 50, order: [['id','DESC']] });
  res.json(items);
}

async function createTransport(req, res){
  const data = req.body; data.user_id = req.user && req.user.sub;
  const t = await Transport.create(data); res.json(t);
}

module.exports = { listTransports, createTransport };
