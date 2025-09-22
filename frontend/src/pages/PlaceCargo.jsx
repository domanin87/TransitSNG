import React, {useState, useEffect} from 'react'; import api from '../utils/api'; import RouteMap from '../components/RouteMap';
export default function PlaceCargo(){ const [form,setForm]=useState({title:'',from_city:'Almaty',to_city:'Astana',weight_kg:0}); const [tariff,setTariff]=useState(null); const [estimate,setEstimate]=useState(null); const [routeCoords,setRouteCoords]=useState(null);
 useEffect(()=>{ api.get('/api/tariffs?start_with='+form.from_city[0]).then(r=>{ setTariff(r.data && r.data[0]); }).catch(()=>{}); },[form.from_city]);
 async function calc(){ try{ const r = await api.post('/api/cargo/estimate', { fromCoords: form.fromCoords || {lat:43.238949,lon:76.889709}, toCoords: form.toCoords || {lat:51.160522,lon:71.470356}, tariffId: tariff && tariff.id }); setEstimate(r.data); // try to fetch route from ORS features via backend if returned
 if(r.data && r.data.source === 'ors' && r.data.route){ // route as array of [lon,lat] pairs
   const coords = r.data.route.map(p=>({ lat: p[1], lon: p[0] })); setRouteCoords(coords);
 } else {
   // fallback straight line
   setRouteCoords([{lat: form.fromCoords?.lat || 43.238949, lon: form.fromCoords?.lon || 76.889709},{lat: form.toCoords?.lat || 51.160522, lon: form.toCoords?.lon || 71.470356}]);
 }
 }catch(e){ alert('Estimate failed: '+e.message); }
 }
 async function submit(e){ e.preventDefault(); const res = await api.post('/api/cargo', form); alert('Создано: '+res.data.id); }
 async function createKaspi(){ const res = await api.post('/api/payments/kaspi', { amount: (estimate && estimate.price) || 0, orderId: 'order-' + Date.now() }); alert('Kaspi mock returned: ' + JSON.stringify(res.data)); }
 async function createHalyk(){ const res = await api.post('/api/payments/halyk', { amount: (estimate && estimate.price) || 0, orderId: 'order-' + Date.now() }); alert('Halyk mock returned: ' + JSON.stringify(res.data)); }
 return (<div className='container'><h2>Разместить груз</h2><form className='card' onSubmit={submit} style={{display:'grid',gap:12}}><input placeholder='Название' value={form.title} onChange={e=>setForm({...form,title:e.target.value})} /><div style={{display:'flex',gap:8}}><input placeholder='Откуда' value={form.from_city} onChange={e=>setForm({...form,from_city:e.target.value})} /><input placeholder='Куда' value={form.to_city} onChange={e=>setForm({...form,to_city:e.target.value})} /></div><input type='number' placeholder='Вес (kg)' value={form.weight_kg} onChange={e=>setForm({...form,weight_kg:parseFloat(e.target.value)})} /><div style={{display:'flex',gap:8}}><button onClick={(e)=>{e.preventDefault(); calc();}}>Посчитать</button><button type='submit'>Разместить</button></div></form>{estimate && (<div className='card' style={{marginTop:12}}>Расстояние: {estimate.km.toFixed(1)} km<br/>Примерная цена: {estimate.price.toFixed(2)}<br/><button onClick={createKaspi}>Оплатить Kaspi (мок)</button> <button onClick={createHalyk}>Оплатить Halyk (мок)</button></div>)}{routeCoords && <div style={{marginTop:16}}><RouteMap from={form.fromCoords||{lat:43.238949,lon:76.889709}} to={form.toCoords||{lat:51.160522,lon:71.470356}} routeCoords={routeCoords} /></div>}</div>); }
