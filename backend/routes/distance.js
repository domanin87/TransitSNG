// backend/routes/distance.js
const express = require('express');
const router = express.Router();

// Minimal city coordinates map. Extend as needed.
const cityCoords = {
  'Almaty': [43.238949,76.889709],
  'Astana': [51.160522,71.470356],
  'Shymkent': [42.3417,69.5901],
  'Pavlodar': [52.287,76.967],
  'Kostanai': [53.2159,63.6311],
  // add more as needed
};

function haversine(a,b){
  const toRad = v => v*Math.PI/180;
  const [lat1,lon1]=a; const [lat2,lon2]=b;
  const R = 6371; // km
  const dLat = toRad(lat2-lat1);
  const dLon = toRad(lon2-lon1);
  const la1 = toRad(lat1), la2 = toRad(lat2);
  const h = Math.sin(dLat/2)*Math.sin(dLat/2)+Math.cos(la1)*Math.cos(la2)*Math.sin(dLon/2)*Math.sin(dLon/2);
  const c = 2*Math.atan2(Math.sqrt(h), Math.sqrt(1-h));
  return R*c;
}

router.get('/', (req,res)=>{
  const {from, to} = req.query;
  if (!from || !to) return res.status(400).json({error:'from and to required'});
  const a = cityCoords[from] || null;
  const b = cityCoords[to] || null;
  if (!a || !b) return res.status(404).json({error:'city coords not found - extend map'});
  const km = Math.round(haversine(a,b));
  const estHours = Math.round(km/70); // rough
  res.json({ from, to, km, estHours });
});

module.exports = router;
