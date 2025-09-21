import React, {useState, useEffect} from 'react';
import api from '../api';
export default function PlaceCargo(){
  const [from,setFrom]=useState(''); const [to,setTo]=useState(''); const [weight,setWeight]=useState(1); const [tariffs,setTariffs]=useState([]); const [result,setResult]=useState(null);
  useEffect(()=>{ async function l(){ try{ const t = await api.get('/api/tariffs'); setTariffs(t.data || t);}catch(e){}}; l(); },[]);
  function calc(){ // simple calc: find tariff by city and multiply price by weight
    const t = tariffs.find(x=> x.city && (x.city.toLowerCase() === from.toLowerCase() || x.city.toLowerCase() === to.toLowerCase()));
    if(!t){ alert('Тариф не найден для города'); return; }
    const total = parseFloat(t.price || 0) * parseFloat(weight || 1);
    setResult({tariff: t.name, total});
  }
  return (<div style={{padding:20}}><h2>Разместить груз — калькулятор</h2>
    <div><input placeholder="Откуда" value={from} onChange={e=>setFrom(e.target.value)}/></div>
    <div><input placeholder="Куда" value={to} onChange={e=>setTo(e.target.value)}/></div>
    <div><input type="number" value={weight} onChange={e=>setWeight(e.target.value)}/> тонна</div>
    <div><button onClick={calc}>Рассчитать</button></div>
    {result && <div style={{marginTop:12}}>Тариф: {result.tariff} — Сумма: {result.total}</div>}
  </div>);
}
