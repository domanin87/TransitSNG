
import React from 'react'
import { Link } from 'react-router-dom'
export default function Header(){ return (<header className='site-header'><div className='container'><Link to='/' className='brand'>TransitSNG</Link><nav className='nav'><Link to='/cargo'>Грузы</Link> <Link to='/tariffs'>Тарифы</Link> <Link to='/chat'>Чат</Link> <Link to='/map'>Карта</Link> <Link to='/admin'>Админ</Link></nav></div></header>) }
