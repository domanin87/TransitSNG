
const router = require('express').Router();
const QRCode = require('qrcode');
const logger = require('../logger');

router.post('/kaspi/qr', async (req,res)=>{
  try{
    const { orderId, amount, currency='KZT' } = req.body;
    const payload = `kaspi://pay?order=${orderId}&amount=${amount}&currency=${currency}`;
    const dataUrl = await QRCode.toDataURL(payload);
    res.json({ qr: dataUrl });
  }catch(e){ logger.error('qr failed', e); res.status(500).json({ error:'qr_failed' }); }
});

module.exports = router;
