import React, { useState } from 'react'
import Typeahead from './Typeahead'
export default function HeroSearch({onSearch}){
  const [from,setFrom] = useState('')
  const [to,setTo] = useState('')
  const [date,setDate] = useState('')
  return (
    <div className="hero">
      <div className="left">
        <h1 style={{marginTop:0}}>Перевозки по странам СНГ — удобно и надёжно</h1>
        <p style={{color:'var(--muted)'}}>Найди перевозчика, размести заказ, отслеживай груз в реальном времени.</p>
        <div className="search-card">
          <Typeahead value={from} onChange={setFrom} placeholder="Откуда" />
          <Typeahead value={to} onChange={setTo} placeholder="Куда" />
          <input className="input" type="date" value={date} onChange={e=>setDate(e.target.value)} />
          <div style={{textAlign:'right'}}><button className="btn" onClick={()=>onSearch(from,to,date)}>Найти</button></div>
        </div>
      </div>
      <div className="right">
        <img src="/assets/hero_light.jpg" style={{width:'100%',borderRadius:12}} alt="hero" />
      </div>
    </div>
  )
}
