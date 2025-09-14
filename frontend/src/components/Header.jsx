import React from 'react'
import { Link } from 'react-router-dom'
import LanguageSwitcher from './LanguageSwitcher'
export default function Header({dark,setDark}){
  return (
    <header className="container header">
      <div style={{display:'flex',alignItems:'center',gap:12}}>
        <Link to="/" className="brand">Транзит СНГ</Link>
        <nav className="nav" style={{display:'flex'}}>
          <Link to="/services">Услуги</Link>
          <Link to="/tariffs" style={{marginLeft:18}}>Тарифы</Link>
          <Link to="/map" style={{marginLeft:18}}>Карта</Link>
          <Link to="/chat" style={{marginLeft:18}}>Чат</Link>
        </nav>
        <LanguageSwitcher />
      </div>
      <div className="header-right">
        <button className="link-btn" onClick={()=>setDark(s=>!s)}>{dark? '🌙' : '🌙'}</button>
        <Link to="/post" className="link-btn">Разместить груз</Link>
        <Link to="/login" className="link-btn">Войти</Link>
      </div>
    </header>
  )
}
