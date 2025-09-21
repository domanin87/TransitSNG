// backend/routes/currency.js
const express = require('express');
const router = express.Router();

router.get('/rates', async (req,res)=>{
  // Stub rates - replace with real API calls (e.g., exchangerate.host or central bank)
  const rates = {
    USD: 531.64,
    EUR: 623.19,
    KZT: 1
  };
  res.json({ base: 'KZT', rates, updatedAt: new Date() });
});

module.exports = router;
