import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { reportsAPI } from '../../index';

export default function Reports({ userRole }) {
  const { t } = useTranslation();
  const [reportType, setReportType] = useState('orders');
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ startDate: '', endDate: '' });
  const canView = ['superadmin', 'admin', 'moderator'].includes(userRole);

  const loadReports = async () => {
    if (!canView) return;
    try {
      setLoading(true);
      let data;
      const params = { startDate: filters.startDate, endDate: filters.endDate };
      if (reportType === 'orders') {
        data = await reportsAPI.getOrderReports(params);
      } else if (reportType === 'payments') {
        data = await reportsAPI.getPaymentReports(params);
      } else if (reportType === 'customers') {
        data = await reportsAPI.getCustomerReports(params);
      }
      setReports(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, [reportType, filters]);

  if (!canView) return <div className="text-red-500">{t('access_denied')}</div>;
  if (loading) return <div className="text-center">{t('loading')}</div>;
  if (error) return <div className="text-red-500">{t('error')}: {error}</div>;

  return (
    <div>
      <h2 className="text-2xl mb-4">{t('reports')}</h2>
      <div className="card mb-5">
        <h3 className="text-lg mb-2">{t('filter_reports')}</h3>
        <div className="grid gap-2">
          <select
            className="input"
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
          >
            <option value="orders">{t('order_reports')}</option>
            <option value="payments">{t('payment_reports')}</option>
            <option value="customers">{t('customer_reports')}</option>
          </select>
          <input
            className="input"
            type="date"
            value={filters.startDate}
            onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
          />
          <input
            className="input"
            type="date"
            value={filters.endDate}
            onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
          />
          <button className="btn" onClick={loadReports}>{t('apply_filters')}</button>
        </div>
      </div>
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left p-3">{t('id')}</th>
            <th className="text-left p-3">{t('details')}</th>
            <th className="text-left p-3">{t('date')}</th>
            <th className="text-left p-3">{t('value')}</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report) => (
            <tr key={report.id} className="border-b border-gray-200">
              <td className="p-3">{report.id}</td>
              <td className="p-3">{report.details}</td>
              <td className="p-3">{report.date}</td>
              <td className="p-3">{report.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}