import React from 'react'
import { Link } from 'react-router-dom'

export default function ServiceCard({ s, logged }) {
  return (
    <article className={'card ' + (s.dark ? 'card-dark' : '')}>
      <h3>{s.title}</h3>
      <div className="meta">{s.route}</div>
      <div className="price">{s.price} {s.currency}</div>
      <div className="meta">{s.weight ? s.weight + ' т' : ''}</div>
      <div style={{ marginTop: 12 }}>
        {logged ? (
          <div style={{ color: '#0b1220' }}>Контакты: {s.contact}</div>
        ) : (
          <div style={{ color: '#6b7280' }}>
            <p>Контакты скрыты — войдите или зарегистрируйтесь</p>
            <div style={{ marginTop: '10px' }}>
              <Link to="/login" className="btn" style={{ marginRight: '10px', padding: '8px 12px' }}>
                Войти
              </Link>
              <Link to="/register" className="btn" style={{ padding: '8px 12px' }}>
                Регистрация
              </Link>
            </div>
          </div>
        )}
      </div>
    </article>
  )
}