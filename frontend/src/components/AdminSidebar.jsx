import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function AdminSidebar({ userRole }) {
  const { t } = useTranslation();
  const location = useLocation();

  const menuItems = [
    { path: '/admin/dashboard', label: t('dashboard'), icon: '📊', roles: ['superadmin', 'admin', 'moderator'] },
    { path: '/admin/users', label: t('users'), icon: '👥', roles: ['superadmin', 'admin', 'moderator'] },
    { path: '/admin/drivers', label: t('drivers'), icon: '🚚', roles: ['superadmin', 'admin', 'moderator'] },
    { path: '/admin/orders', label: t('orders'), icon: '📦', roles: ['superadmin', 'admin', 'moderator'] },
    { path: '/admin/payments', label: t('payments'), icon: '💰', roles: ['superadmin', 'admin'] },
    { path: '/admin/reports', label: t('reports'), icon: '📈', roles: ['superadmin', 'admin'] },
    { path: '/admin/tariffs', label: t('tariffs'), icon: '🎯', roles: ['superadmin', 'admin'] },
    { path: '/admin/verifications', label: t('verifications'), icon: '✅', roles: ['superadmin', 'admin', 'moderator'] },
    { path: '/admin/settings', label: t('settings'), icon: '⚙️', roles: ['superadmin'] },
  ];

  const filteredMenu = menuItems.filter((item) => item.roles.includes(userRole));

  return (
    <div style={{
      width: 250,
      background: 'var(--card)',
      padding: '20px 0',
      height: '100vh',
      position: 'fixed',
      left: 0,
      top: 0,
      boxShadow: 'var(--shadow)',
    }}>
      <h3 style={{ padding: '0 20px 20px', margin: 0 }}>{t('admin_panel')}</h3>
      {filteredMenu.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '12px 20px',
            textDecoration: 'none',
            color: location.pathname === item.path ? 'var(--accent)' : 'var(--text)',
            background: location.pathname === item.path ? 'rgba(96, 165, 250, 0.1)' : 'transparent',
            borderRight: location.pathname === item.path ? '3px solid var(--accent)' : 'none',
            fontWeight: location.pathname === item.path ? '600' : 'normal',
          }}
        >
          <span style={{ marginRight: 12, fontSize: 18 }}>{item.icon}</span>
          {item.label}
        </Link>
      ))}
    </div>
  );
}