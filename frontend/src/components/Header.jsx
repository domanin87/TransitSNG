import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

export default function Header({ dark, setDark, user, setUser }) {
  const { t } = useTranslation();

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    window.location.href = '/';
  };

  return (
    <header className="container header">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Link to="/" className="brand">Транзит СНГ</Link>
        <nav className="nav" style={{ display: 'flex' }}>
          <Link to="/services">{t('services')}</Link>
          <Link to="/tariffs" style={{ marginLeft: 18 }}>{t('tariffs')}</Link>
          <Link to="/map" style={{ marginLeft: 18 }}>{t('map')}</Link>
          <Link to="/chat" style={{ marginLeft: 18 }}>{t('chat')}</Link>
        </nav>
        <LanguageSwitcher />
      </div>
      <div className="header-right">
        <button className="link-btn" onClick={() => setDark((s) => !s)}>
          {dark ? '☀️' : '🌙'}
        </button>
        {user ? (
          <>
            {(user.role === 'superadmin' || user.role === 'admin' || user.role === 'moderator') && (
              <Link to="/admin/dashboard" className="link-btn">{t('admin')}</Link>
            )}
            <Link to="/post" className="link-btn">{t('post_cargo')}</Link>
            <span style={{ color: 'var(--text)' }}>{user.name}</span>
            <button className="link-btn" onClick={handleLogout}>{t('logout')}</button>
          </>
        ) : (
          <>
            <Link to="/post" className="link-btn">{t('post_cargo')}</Link>
            <Link to="/register" className="link-btn">{t('register')}</Link>
            <Link to="/login" className="link-btn">{t('login')}</Link>
          </>
        )}
      </div>
    </header>
  );
}