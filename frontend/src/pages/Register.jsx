import React, { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    userType: 'customer'
  })

  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name) newErrors.name = 'Имя обязательно'
    if (!formData.email && !formData.phone) newErrors.contact = 'Укажите email или телефон'
    if (formData.password.length < 6) newErrors.password = 'Пароль должен быть не менее 6 символов'
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Пароли не совпадают'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      alert('Регистрация прошла успешно!')
      window.location.href = '/'
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className='container'>
      <h2>Регистрация</h2>
      <div style={{ maxWidth: 500 }} className='card'>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 15 }}>
            <label style={{ display: 'block', marginBottom: 5 }}>Тип пользователя</label>
            <select name="userType" value={formData.userType} onChange={handleChange} className="input" >
              <option value="customer">Заказчик</option>
              <option value="driver">Водитель</option>
            </select>
          </div>

          <div style={{ marginBottom: 15 }}>
            <label style={{ display: 'block', marginBottom: 5 }}>Имя</label>
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange}
              className="input" 
              placeholder="Ваше имя"
            />
            {errors.name && <span style={{ color: 'red', fontSize: 14 }}>{errors.name}</span>}
          </div>

          <div style={{ marginBottom: 15 }}>
            <label style={{ display: 'block', marginBottom: 5 }}>Email</label>
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange handleChange}
              className="input" 
              placeholder="Email"
            />
          </div>

          <div style={{ marginBottom: 15 }}>
            <label style={{ display: 'block', marginBottom: 5 }}>Телефон</label>
            <input 
              type="tel" 
              name="phone" 
              value={formData.phone} 
              onChange={handleChange}
              className="input" 
              placeholder="+7 (777) 123-45-67"
            />
            {(errors.contact && !formData.email && !formData.phone) && 
              <span style={{ color: 'red', fontSize: 14 }}>{errors.contact}</span>}
          </div>

          <div style={{ marginBottom: 15 }}>
            <label style={{ display: 'block', marginBottom: 5 }}>Пароль</label>
            <input 
              type="password" 
              name="password" 
              value={formData.password} 
              onChange={handleChange}
              className极 input" 
              placeholder="Не менее 6 символов"
            />
            {errors.password && <span style={{ color: 'red', fontSize: 14 }}>{errors.password}</span>}
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', marginBottom: 5 }}>Подтверждение пароля</label>
            <input 
              type="password" 
              name="confirmPassword" 
              value={formData.confirmPassword} 
              onChange={handleChange}
              className="input" 
              placeholder="Повторите пароль"
            />
            {errors.confirmPassword && <span style={{ color: 'red', fontSize: 14 }}>{errors.confirmPassword}</span>}
          </div>

          <div style={{ textAlign: 'right' }}>
            <button type="submit className="btn">Зарегистрироваться</button>
          </div>

          <div style={{ marginTop: 20, textAlign: 'center' }}>
            Уже есть аккаунт? <Link to="/login">Войти</Link>
          </div>
        </form>
      </div>
    </div>
  )
}