import React, { useState } from 'react';

const Reports = ({ userRole }) => {
  const [startDate, setStartDate] = useState('2023-10-01');
  const [endDate, setEndDate] = useState('2023-10-31');
  const [reportType, setReportType] = useState('orders');

  const reportsData = {
    totalOrders: 42,
    completedOrders: 35,
    cancelledOrders: 3,
    totalRevenue: '2,450,000 ₸',
    commissionRevenue: '122,500 ₸',
    activeDrivers: 18,
    newUsers: 25,
    averageOrderValue: '58,333 ₸'
  };

  const ordersByDay = [
    { date: '2023-10-01', orders: 5, revenue: '300,000 ₸' },
    { date: '2023-10-02', orders: 3, revenue: '180,000 ₸' },
    { date: '2023-10-03', orders: 7, revenue: '420,000 ₸' },
    { date: '2023-10-04', orders: 4, revenue: '240,000 ₸' },
    { date: '2023-10-05', orders: 6, revenue: '360,000 ₸' },
  ];

  const generateReport = () => {
    alert(`Отчет сгенерирован за период с ${startDate} по ${endDate}`);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2>Отчеты</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="input"
            style={{ width: '200px' }}
          >
            <option value="orders">По заказам</option>
            <option value="payments">По платежам</option>
            <option value="users">По пользователям</option>
            <option value="drivers">По водителям</option>
          </select>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="input"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="input"
          />
          <button className="btn" onClick={generateReport}>Сформировать отчет</button>
          <button className="btn" style={{ background: '#4ade80' }}>Экспорт в Excel</button>
          <button className="btn" style={{ background: '#ef4444' }}>Печать</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20, marginBottom: 20 }}>
        <div className="card">
          <h3>Всего заказов</h3>
          <p style={{ fontSize: 24, fontWeight: 'bold', color: 'var(--accent)' }}>{reportsData.totalOrders}</p>
        </div>
        <div className="card">
          <h3>Завершенные заказы</h3>
          <p style={{ fontSize: 24, fontWeight: 'bold', color: 'var(--accent)' }}>{reportsData.completedOrders}</p>
        </div>
        <div className="card">
          <h3>Общий доход</h3>
          <p style={{ fontSize: 24, fontWeight: 'bold', color: 'var(--accent)' }}>{reportsData.totalRevenue}</p>
        </div>
        <div className="card">
          <h3>Доход с комиссий</h3>
          <p style={{ fontSize: 24, fontWeight: 'bold', color: 'var(--accent)' }}>{reportsData.commissionRevenue}</p>
        </div>
        <div className="card">
          <h3>Активные водители</h3>
          <p style={{ fontSize: 24, fontWeight: 'bold', color: 'var(--accent)' }}>{reportsData.activeDrivers}</p>
        </div>
        <div className="card">
          <h3>Новые пользователи</h3>
          <p style={{ fontSize: 24, fontWeight: 'bold', color: 'var(--accent)' }}>{reportsData.newUsers}</p>
        </div>
        <div className="card">
          <h3>Средний чек</h3>
          <p style={{ fontSize: 24, fontWeight: 'bold', color: 'var(--accent)' }}>{reportsData.averageOrderValue}</p>
        </div>
        <div className="card">
          <h3>Отмененные заказы</h3>
          <p style={{ fontSize: 24, fontWeight: 'bold', color: 'var(--accent)' }}>{reportsData.cancelledOrders}</p>
        </div>
      </div>

      <div className="card">
        <h3>Статистика заказов по дням</h3>
        <table style={{ width: '100', borderCollapse: 'collapse', marginTop: '15px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #e6eef6' }}>
              <th style={{ textAlign: 'left', padding: '12px' }}>Дата</th>
              <th style={{ textAlign: 'left', padding: '12px' }}>Количество заказов</th>
              <th style={{ textAlign: 'left', padding: '12px' }}>Доход</th>
            </tr>
          </thead>
          <tbody>
            {ordersByDay.map((day, index) => (
              <tr key={index} style={{ borderBottom: '1px solid #f0f0f0' }}>
                <td style={{ padding: '12px' }}>{day.date}</td>
                <td style={{ padding: '12px' }}>{day.orders}</td>
                <td style={{ padding: '12px', fontWeight: 'bold' }}>{day.revenue}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reports;