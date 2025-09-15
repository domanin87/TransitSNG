import React, {useState, useEffect} from 'react'
import axios from 'axios'
export default function Tariffs(){
  const [weight,setWeight]=useState(1), [from,setFrom]=useState('Алматы'), [to,setTo]=useState('Москва'), [price,setPrice]=useState(null), [rate,setRate]=useState(1)
  useEffect(()=>{ axios.get('https://api.exchangerate.host/latest?base=USD&symbols=KZT,RUB,USD').then(r=>setRate(r.data.rates)).catch(()=>setRate({USD:1})) },[])
  const calc = ()=>{
    // sample tariff rule: base 100 USD per ton + distance factor
    const base = 100 * weight
    setPrice({usd: base, kzt: Math.round(base * (rate.KZT||450)), rub: Math.round(base * (rate.RUB||90))})
  }
  return (
    <div className="container">
      <h2>Калькулятор тарифов</h2>
      <div style={{display:'flex',gap:12,alignItems:'center'}}>
        <input className="input small" value={weight} onChange={e=>setWeight(Number(e.target.value))} type="number" />
        <input className="input small" value={from} onChange={e=>setFrom(e.target.value)} />
        <input className="input small" value={to} onChange={e=>setTo(e.target.value)} />
        <button className="btn" onClick={calc}>Рассчитать</button>
      </div>
      {price && <div style={{marginTop:12}}><strong>Цена:</strong> {price.usd} USD / {price.kzt} KZT / {price.rub} RUB</div>}
    </div>
  )
}
