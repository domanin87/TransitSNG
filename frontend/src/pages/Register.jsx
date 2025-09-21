import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../index';

export default function Register() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '', userType: 'user' });
  const [error, setError] = useState(null);

  const handleRegister = async () => {
    try {
      const { user, token } = await authAPI.register(formData);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container max-w-md">
      <h2 className="text-2xl mb-4">{t('register')}</h2>
      <div className="card">
        {error && <div className="text-red-500 mb-4">{t('error')}: {error}</div>}
        <div className="grid gap-2">
          <input
            className="input"
            placeholder={t('name')}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <input
            className="input"
            placeholder={t('email')}
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <input
            className="input"
            placeholder={t('phone')}
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
          <input
            className="input"
            type="password"
            placeholder={t('password')}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
          <select
            className="input"
            value={formData.userType}
            onChange={(e) => setFormData({ ...formData, userType: e.target.value })}
          >
            <option value="user">{t('user')}</option>
            <option value="driver">{t('driver')}</option>
          </select>
          <button className="btn" onClick={handleRegister}>{t('register')}</button>
        </div>
      </div>
    </div>
  );
}