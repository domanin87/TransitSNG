import React from 'react'
import { Link } from 'react-router-dom'
export default function Header({dark,setDark}){
  return (
    <header className="site-header">
      <div className="container">
        <Link to="/" className="brand">Транзит СНГ</Link>
        <nav className="nav">
          <Link to="/services">Услуги</Link>
          <Link to="/tariffs">Тарифы</Link>
          <Link to="/map">Карта</Link>
          <Link to="/chat">Чат</Link>
        </nav>
        <div className="header-right">
          <button className="header-btn" onClick={()=>setDark(!dark)}>{dark ? '☀️' : '🌙'}</button>
          <Link to="/login" className="header-btn">Войти</Link>
          <button className="header-btn primary">Разместить груз</button>
        </div>
      </div>
    </header>
  )
}
