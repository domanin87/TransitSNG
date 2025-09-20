import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Users from './Users'

export default function Admin() {
  return (
    <div className='container'>
      <h2>Админка</h2>
      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
        <Link to="/admin/users" className="btn small">Пользователи</Link>
        <Link to="/admin/orders" className="btn small">Заказы</Link>
        <Link to="/admin/tariffs" className="btn small">Тарифы</Link>
      </div>
      
      <Routes>
        <Route path="users" element={<Users />} />
        <Route path="orders" element={<div><h3>Управление заказами</h3><p>Интерфейс управления заказами (demo)</p></div>} />
        <Route path="tariffs" element={<div><h3>Управление тарифами</h3><p>Интерфейс управления тарифами (demo)</p></div>} />
        <Route path="*" element={<div><p>Выберите раздел для управления</p></div>} />
      </Routes>
    </div>
  )
}