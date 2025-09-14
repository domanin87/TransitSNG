import React, {useState,useEffect} from 'react'
import Typeahead from '../components/Typeahead'
import ServiceList from '../components/ServiceList'
import sampleData from '../sampleData'

export default function Home(){
  const [from,setFrom]=useState(''), [to,setTo]=useState(''), [items,setItems]=useState([])
  const [logged,setLogged] = useState(!!localStorage.getItem('token'))
  useEffect(()=> setItems(sampleData), [])
  const onSearch = ()=>{
    const q = sampleData.filter(s=> (!from||s.route.toLowerCase().includes(from.toLowerCase())) && (!to||s.route.toLowerCase().includes(to.toLowerCase())) )
    setItems(q)
  }
  return (
    <div className="container">
      <div className="hero-search" style={{alignItems:'center'}}>
        <div className="search-panel">
          <div style={{display:'flex',gap:8}} className="search-input">
            <div style={{flex:1}}><Typeahead value={from} onChange={setFrom} placeholder="Откуда" /></div>
            <div style={{flex:1}}><Typeahead value={to} onChange={setTo} placeholder="Куда" /></div>
            <input className="input small" type="date" />
            <button className="btn" onClick={onSearch}>Найти</button>
          </div>
        </div>
      </div>

      <h2 style={{marginTop:18}}>Активные заказы</h2>
      <ServiceList items={items} logged={logged} />
      <div className="footer">© Транзит СНГ</div>
    </div>
  )
}
