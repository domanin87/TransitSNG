import React, {useState, useEffect} from 'react'
import axios from 'axios'

export default function Tariffs(){
  const [weight,setWeight]=useState(1)
  const [from,setFrom]=useState('Алматы')
  const [to,setTo]=useState('Москва')
  const [price,setPrice]=useState(null)
  const [rate,setRate]=useState({USD: 1, KZT: 450, RUB: 90}) // Значения по умолчанию

  useEffect(()=>{
    axios.get('https://api.exchangerate.host/latest?base=USD&symbols=KZT,RUB,USD')
      .then(r => {
        if (r.data && r.data.rates) {
          setRate(r.data.rates)
        }
      })
      .catch(() => {
        // В случае ошибки используем значения по умолчанию
        console.log('Ошибка загрузки курсов валют, используются значения по умолчанию')
      })
  },[])

  const calc = ()=>{
    // sample tariff rule: base 100 USD per ton + distance factor
    const base = 100 * weight
    
    // Безопасное обращение к свойствам rate
    const kztRate = rate.KZT || 450
    const rubRate = rate.RUB || 90
    
    setPrice({
      usd: base, 
      kzt: Math.round(base * kztRate), 
      rub: Math.round(base * rubRate)
    })
  }

  return (
    <div className="container">
      <h2>Калькулятор тарифов</h2>
      <div style={{display:'flex',gap:12,alignItems:'center', flexWrap: 'wrap'}}>
        <input className="input small" value={weight} onChange={e=>setWeight(Number(e.target.value))} type="number" />
        <input className="input small" value={from} onChange={e=>setFrom(e.target.value)} />
        <input className="input small" value={to} onChange={e=>setTo(e.target.value)} />
        <button className="btn" onClick={calc}>Рассчитать</button>
      </div>
      {price && (
        <div style={{marginTop:12}}>
          <strong>Цена:</strong> {price.usd} USD / {price.kzt} KZT / {price.rub} RUB
        </div>
      )}
    </div>
  )
}