import React, { useState } from 'react';

const Reports = ({ userRole }) => {
const [startDate, setStartDate] = useState('2023-10-01');
const [endDate, setEndDate] = useState('2023-10-31');

const reportsData = {
totalOrders: 42,
completedOrders: 35,
totalRevenue: '2,450,000 ₸',
activeDrivers: 18,
newUsers: 25
};

return (
<div>
<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
<h2>Отчеты</h2>
<div style={{ display: 'flex', gap: '10px' }}>
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
<button className="btn">Сформировать отчет</button>
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
      <h3>Активные водители</h3>
      <p style={{ fontSize: 24, fontWeight: 'bold', color: 'var(--accent)' }}>{reportsData.activeDrivers}</p>
    </div>
  </div>

  <div className="card">
    <h3>Детализация по заказам</h3>
    <p>Здесь будет детальная таблица с заказами за выбранный период</p>
  </div>
</div>

);
};

export default Reports;