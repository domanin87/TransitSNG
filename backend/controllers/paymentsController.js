const kaspi = require('../services/payments/kaspi');
const halyk = require('../services/payments/halyk');

async function createKaspi(req, res){
  const { amount, orderId, returnUrl } = req.body || {};
  const r = await kaspi.createPayment({ amount, orderId, returnUrl });
  res.json(r);
}
async function createHalyk(req, res){
  const { amount, orderId, returnUrl } = req.body || {};
  const r = await halyk.createPayment({ amount, orderId, returnUrl });
  res.json(r);
}
module.exports = { createKaspi, createHalyk };