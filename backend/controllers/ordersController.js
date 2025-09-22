const db = require('../models');
const Order = db.Order;

async function acceptOrder(req, res){
  const o = await Order.findByPk(req.params.id);
  if(!o) return res.status(404).json({error:'not found'});
  o.status = 'accepted'; o.driver_id = req.user && req.user.sub;
  await o.save(); res.json(o);
}

module.exports = { acceptOrder };
