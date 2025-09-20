import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminSidebar from '../../components/AdminSidebar';
import Dashboard from './Dashboard';
import Users from './Users';
import Drivers from './Drivers';
import Orders from './Orders';
import Payments from './Payments';
import Reports from './Reports';
import Tariffs from './Tariffs';
import Verifications from './Verifications';
import Settings from './Settings';

const Admin = () => {
  const [userRole, setUserRole] = useState('moderator');

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUserRole(userData.role || 'moderator');
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <AdminSidebar userRole={userRole} />
      <div style={{ marginLeft: 250, padding: '20px', width: 'calc(100% - 250px)' }}>
        <Routes>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<Users userRole={userRole} />} />
          <Route path="drivers" element={<Drivers userRole={userRole} />} />
          <Route path="orders" element={<Orders userRole={userRole} />} />
          <Route path="payments" element={<Payments userRole={userRole} />} />
          <Route path="reports" element={<Reports userRole={userRole} />} />
          <Route path="tariffs" element={<Tariffs userRole={userRole} />} />
          <Route path="verifications" element={<Verifications userRole={userRole} />} />
          <Route path="settings" element={<Settings userRole={userRole} />} />
        </Routes>
      </div>
    </div>
  );
};

export default Admin;