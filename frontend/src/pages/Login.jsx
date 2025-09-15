import React, { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Login() {
const [email, setEmail] = useState('')
const [password, setPassword] = useState('')
const [rememberMe, setRememberMe] = useState(false)

const handleLogin = (e) => {
e.preventDefault()
// Проверка суперадмина
if (email === 'adomanin87' && password === '558554T') {
  const userData = {
    id: 1,
    name: 'Супер Администратор',
    email: 'adomanin87',
    role: 'superadmin',
    token: 'superadmin-token'
  }
  localStorage.setItem('user', JSON.stringify(userData))
  localStorage.setItem('token', userData.token)
  alert('Вход выполнен как суперадмин')
  window.location.href = '/admin/dashboard'
  return
}

// Обычная логика входа
const userData = {
  id: 2,
  name: 'Тестовый Пользователь',
  email: email,
  role: 'user',
  token: 'user-token'
}
localStorage.setItem('user', JSON.stringify(userData))
localStorage.setItem('token', userData.token)
alert('Вход выполнен')
window.location.href = '/'
}

return (
<div className='container'>
<h2>Вход</h2>
<div style={{ maxWidth: 420 }} className='card'>
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
      <div>Суперадмин: adomanin87 </div>
    </div>
  </div>
</div>
)
}