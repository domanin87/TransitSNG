import React, { useState, useEffect } from 'react'
import HeroSearch from '../components/HeroSearch'
import ServiceList from '../components/ServiceList'
import sampleData from '../sampleData'

export default function Home(){ 
  const [items,setItems] = useState([])
  const [logged,setLogged] = useState(!!localStorage.getItem('token'))
  useEffect(()=>{ setItems(sampleData) },[])
  const onSearch = (from,to,date) => {
    const q = sampleData.filter(s=> (!from||s.route.toLowerCase().includes(from.toLowerCase())) && (!to||s.route.toLowerCase().includes(to.toLowerCase())) )
    setItems(q)
  }
  return (
    <div className="container">
      <HeroSearch onSearch={onSearch} />
      <h2 style={{marginTop:22}}>Активные заказы</h2>
      <ServiceList items={items} logged={logged} />
      <div className="footer">© Транзит СНГ — все права защищены</div>
    </div>
  )
}
