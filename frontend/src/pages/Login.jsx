import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { authAPI } from '../api'

export default function Login({ setUser }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const response = await authAPI.login({ email, password })
      
      localStorage.setItem('user', JSON.stringify(response.user))
      localStorage.setItem('token', response.token)
      setUser(response.user)
      
      alert('Вход выполнен')
      window.location.href = '#/'
    } catch (err) {
      setError('Неверные учетные данные')
    }
  }

  return (
    <div className='container'>
      <h2>Вход</h2>
      <div style={{ maxWidth: 420 }} className='card'>
        {error && <div style={{ color: 'red', marginBottom: 15 }}>{error}</div>}
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: 15 }}>
            <input
              className='input'
              placeholder='Email или телефон'
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div style={{ marginBottom: 15 }}>
            <input
              className='input'
              placeholder='Пароль'
              type='password'
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
            <input
              type="checkbox"
              id="remember"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
              style={{ marginRight: 8 }}
            />
            <label htmlFor="remember">Запомнить меня</label>
          </div>
          <div style={{ textAlign: 'right' }}>
            <button type="submit" className="btn">Войти</button>
          </div>
        </form>

        <div style={{ marginTop: 20, textAlign: 'center' }}>
          Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
        </div>

        <div style={{ marginTop: 15, padding: 15, background: '#f5f5f5', borderRadius: 8, fontSize: 14 }}>
          <strong>Тестовые данные:</strong>
          <div>Суперадмин: adomanin87 / 558554T</div>
        </div>
      </div>
    </div>
  )
}