import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const AdminSidebar = ({ userRole }) => {
  const location = useLocation();

  const menuItems = [
    { path: '/admin/dashboard', label: 'Дашборд', icon: '📊', roles: ['superadmin', 'admin', 'moderator'] },
    { path: '/admin/users', label: 'Пользователи', icon: '👥', roles: ['superadmin', 'admin', 'moderator'] },
    { path: '/admin/drivers', label: 'Водители', icon: '🚚', roles: ['superadmin', 'admin', 'moderator'] },
    { path: '/admin/orders', label: 'Заказы', icon: '📦', roles: ['superadmin', 'admin', 'moderator'] },
    { path: '/admin/payments', label: 'Платежи', icon: '💰', roles: ['superadmin', 'admin'] },
    { path: '/admin/reports', label: 'Отчеты', icon: '📈', roles: ['superadmin', 'admin'] },
    { path: '/admin/tariffs', label: 'Тарифы', icon: '🎯', roles: ['superadmin', 'admin'] },
    { path: '/admin/verifications', label: 'Верификации', icon: '✅', roles: ['superadmin', 'admin', 'moderator'] },
    { path: '/admin/settings', label: 'Настройки', icon: '⚙️', roles: ['superadmin'] },
  ];

  const filteredMenu = menuItems.filter(item => item.roles.includes(userRole));

  return (
    <div style={{
      width: 250,
      background: 'var(--card)',
      padding: '20px 0',
      height: '100vh',
      position: 'fixed',
      left: 0,
      top: 0,
      boxShadow: 'var(--shadow)'
    }}>
      <h3 style={{ padding: '0 20px 20px', margin: 0 }}>Панель управления</h3>
      
      {filteredMenu.map(item => (
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
            fontWeight: location.pathname === item.path ? '600' : 'normal'
          }}
        >
          <span style={{ marginRight: 12, fontSize: 18 }}>{item.icon}</span>
          {item.label}
        </Link>
      ))}
    </div>
  );
};

export default AdminSidebar;