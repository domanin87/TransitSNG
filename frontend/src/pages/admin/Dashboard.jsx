import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { dashboardAPI } from '../../index';

export default function Dashboard({ userRole }) {
  const { t } = useTranslation();
  const [stats, setStats] = useState({ orders: 0, customers: 0, drivers: 0, payments: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await dashboardAPI.getStats();
      setStats(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center">{t('loading')}</div>;
  if (error) return <div className="text-red-500">{t('error')}: {error}</div>;

  return (
    <div>
      <h2 className="text-2xl mb-4">{t('dashboard')}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card">
          <h3 className="text-lg mb-2">{t('total_orders')}</h3>
          <p className="text-2xl">{stats.orders}</p>
        </div>
        <div className="card">
          <h3 className="text-lg mb-2">{t('total_customers')}</h3>
          <p className="text-2xl">{stats.customers}</p>
        </div>
        <div className="card">
          <h3 className="text-lg mb-2">{t('total_drivers')}</h3>
          <p className="text-2xl">{stats.drivers}</p>
        </div>
        <div className="card">
          <h3 className="text-lg mb-2">{t('total_payments')}</h3>
          <p className="text-2xl">{stats.payments}</p>
        </div>
      </div>
    </div>
  );
}