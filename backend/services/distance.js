const axios = require('axios');

/**
 * calculateDistance(fromCoords, toCoords)
 * fromCoords = { lat, lon } ; toCoords = { lat, lon }
 * Uses ORS if ORS_API_KEY present in env, otherwise fallback to haversine.
 */
async function calculateDistance(fromCoords, toCoords){
  const ORS_KEY = process.env.ORS_API_KEY;
  if(ORS_KEY){
    try{
      const url = 'https://api.openrouteservice.org/v2/directions/driving-car';
      const coords = [[fromCoords.lon, fromCoords.lat],[toCoords.lon,toCoords.lat]];
      const res = await axios.post(url, { coordinates: coords }, { headers: { Authorization: ORS_KEY, 'Content-Type': 'application/json' }, timeout: 10000 });
      if(res.data && res.data.features && res.data.features[0] && res.data.features[0].properties && res.data.features[0].properties.summary){
        const km = res.data.features[0].properties.summary.distance / 1000.0;
        return { km, source: 'ors' };
      }
    }catch(err){
      console.log('ORS failed, fallback to haversine', err.message);
    }
  }
  // haversine fallback
  function toRad(v){ return v * Math.PI/180; }
  const R = 6371;
  const dLat = toRad(toCoords.lat - fromCoords.lat);
  const dLon = toRad(toCoords.lon - fromCoords.lon);
  const a = Math.sin(dLat/2)*Math.sin(dLat/2) + Math.cos(toRad(fromCoords.lat))*Math.cos(toRad(toCoords.lat))*Math.sin(dLon/2)*Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const km = R * c;
  return { km, source: 'haversine' };
}

module.exports = { calculateDistance };
