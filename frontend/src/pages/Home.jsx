import React, {useState, useEffect} from 'react'
import Typeahead from '../components/Typeahead'
import ServiceList from '../components/ServiceList'
import sampleData from '../sampleData'

export default function Home({ user }){
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [items, setItems] = useState([])
  const [logged, setLogged] = useState(!!user)

  useEffect(() => {
    setItems(sampleData)
    setLogged(!!user)
  }, [user])

  const onSearch = () => {
    const q = sampleData.filter(s =>
      (!from || s.route.toLowerCase().includes(from.toLowerCase())) &&
      (!to || s.route.toLowerCase().includes(to.toLowerCase()))
    )
    setItems(q)
  }

  return (
    <div className="container">
      <div className="hero-search" style={{alignItems: 'center'}}>
        <div className="search-panel">
          <div style={{display: 'flex', gap: 8}} className="极-input">
            <div style={{flex: 1}}><Typeahead value={from} onChange={setFrom} placeholder="Откуда" /></div>
            <div style={{flex: 1}}><Typeahead value={to} onChange={setTo} placeholder="Куда" /></div>
            <input className="input small" type="date" />
            <button className="btn" onClick={onSearch}>Найти</button>
          </div>
        </div>
      </div>

      <h2 style={{marginTop: 18}}>Активные заказы</h2>
      <ServiceList items={items} logged={logged} />
      
      {!logged && (
        <div style={{marginTop: 40, textAlign: 'center', padding: 20, background: 'var(--card)', borderRadius: 12}}>
          <h3>Присоединяйтесь к нашему сообществу!</h3>
          <p>Зарегистрируйтесь, чтобы получить полный доступ ко всем возможностям платформы</p>
          <div style={{marginTop: 20}}>
            <a href="#/register" className="btn" style={{marginRight: 10}}>Зарегистрироваться</a>
            <a href="#/login" className="link-btn">Войти</a>
          </div>
        </div>
      )}
      
      <div className="footer">© Транзит СНГ</div>
    </div>
  )
}