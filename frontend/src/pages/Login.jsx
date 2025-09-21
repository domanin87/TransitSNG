import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../index';

export default function Login({ setUser }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    try {
      const { user, token } = await authAPI.login({ email, password });
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
      setUser(user);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container max-w-md">
      <h2 className="text-2xl mb-4">{t('login')}</h2>
      <div className="card">
        {error && <div className="text-red-500 mb-4">{t('error')}: {error}</div>}
        <div className="grid gap-2">
          <input
            className="input"
            placeholder={t('email_or_phone')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="input"
            type="password"
            placeholder={t('password')}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="btn" onClick={handleLogin}>{t('login')}</button>
        </div>
      </div>
    </div>
  );
}