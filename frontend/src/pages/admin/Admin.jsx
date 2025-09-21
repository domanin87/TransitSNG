import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminSidebar from '../../components/AdminSidebar';
import Users from './Users';
import Drivers from './Drivers';
import Orders from './Orders';
import Payments from './Payments';
import Reports from './Reports';
import Tariffs from './Tariffs';
import Verifications from './Verifications';
import Settings from './Settings';

export default function Admin({ user }) {
  const userRole = user?.role || 'moderator';

  return (
    <div className="container flex">
      <AdminSidebar userRole={userRole} />
      <div style={{ marginLeft: 250, padding: 20, flex: 1 }}>
        <Routes>
          <Route path="dashboard" element={<div>Дашборд (в разработке)</div>} />
          <Route path="users" element={<Users userRole={userRole} />} />
          <Route path="drivers" element={<Drivers userRole={userRole} />} />
          <Route path="orders" element={<Orders userRole={userRole} />} />
          <Route path="payments" element={<Payments userRole={userRole} />} />
          <Route path="reports" element={<Reports userRole={userRole} />} />
          <Route path="tariffs" element={<Tariffs userRole={userRole} />} />
          <Route path="verifications" element={<Verifications userRole={userRole} />} />
          <Route path="settings" element={<Settings userRole={userRole} />} />
          <Route path="*" element={<div>Выберите раздел</div>} />
        </Routes>
      </div>
    </div>
  );
}