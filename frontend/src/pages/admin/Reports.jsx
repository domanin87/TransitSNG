import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { reportsAPI } from '../../index';

export default function Reports({ userRole }) {
  const { t } = useTranslation();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);

  const canGenerate = ['superadmin', 'admin'].includes(userRole);

  const generateReport = async () => {
    if (!canGenerate) return;
    try {
      const data = await reportsAPI.generate(startDate, endDate);
      setReport(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const exportReport = async (format) => {
    if (!canGenerate) return;
    try {
      const data = await reportsAPI.export(format);
      const blob = new Blob([data], { type: format === 'csv' ? 'text/csv' : 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `report.${format}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message);
    }
  };

  if (!canGenerate) return <div>{t('access_denied')}</div>;

  return (
    <div>
      <h2 className="text-2xl mb-4">{t('reports')}</h2>
      <div className="card mb-5">
        <h3 className="text-lg mb-2">{t('generate_report')}</h3>
        <div className="grid gap-2">
          <input
            className="input"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <input
            className="input"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <button className="btn" onClick={generateReport}>{t('generate')}</button>
        </div>
      </div>
      {error && <div className="text-red-500 mb-4">{t('error')}: {error}</div>}
      {report && (
        <div className="card">
          <h3 className="text-lg mb-2">{t('report_results')}</h3>
          <p>{t('total_orders')}: {report.totalOrders}</p>
          <p>{t('total_amount')}: {report.totalAmount} USD</p>
          <div className="mt-4">
            <button className="btn mr-2" onClick={() => exportReport('csv')}>{t('export_csv')}</button>
            <button className="btn" onClick={() => exportReport('pdf')}>{t('export_pdf')}</button>
          </div>
        </div>
      )}
    </div>
  );
}