import React, { useState } from 'react';

const Payments = ({ userRole }) => {
const [payments, setPayments] = useState([
{
id: 5001,
orderId: 1001,
user: 'Иван Иванов',
amount: '120 000 ₸',
method: 'Карта',
status: 'completed',
date: '2023-10-15',
commission: '6 000 ₸'
},
{
id: 5002,
orderId: 1002,
user: 'Петр Петров',
amount: '150 000 ₸',
method: 'Перевод',
status: 'pending',
date: '2023-10-16',
commission: '7 500 ₸'
},
{
id: 5003,
orderId: 1003,
user: 'Сергей Сергеев',
amount: '80 000 ₸',
method: 'Карта',
status: 'completed',
date: '2023-10-14',
commission: '4 000 ₸'
},
]);

const getStatusColor = (status) => {
switch(status) {
case 'completed': return '#4ade80';
case 'pending': return '#fbbf24';
case 'failed': return '#f87171';
default: return '#6b7280';
}
};

const getStatusText = (status) => {
switch(status) {
case 'completed': return 'Завершен';
case 'pending': return 'Ожидание';
case 'failed': return 'Ошибка';
default: return status;
}
};

const totalRevenue = payments
.filter(p => p.status === 'completed')
.reduce((sum, payment) => sum + parseInt(payment.commission.replace(/\s|₸/g, '')), 0);

return (
<div>
<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
<h2>Платежи</h2>
<div style={{ display: 'flex', gap: '10px' }}>
<select className="input" style={{ width: '200px' }}>
<option value="all">Все статусы</option>
<option value="completed">Завершенные</option>
<option value="pending">Ожидающие</option>
<option value="failed">Ошибки</option>
</select>
<input
type="text"
placeholder="Поиск платежей..."
className="input"
style={{ width: '250px' }}
/>
<button className="btn">Экспорт</button>
</div>
</div>


  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20, marginBottom: 20 }}>
    <div className="card">
      <h3>Общий доход</h3>
      <p style={{ fontSize: 24, fontWeight: 'bold', color: 'var(--accent)' }}>
        {totalRevenue.toLocaleString('ru-RU')} ₸
      </p>
    </div>
    <div className="card">
      <h3>Всего платежей</h3>
      <p style={{ fontSize: 24, fontWeight: 'bold', color: 'var(--accent)' }}>{payments.length}</p>
    </div>
    <div className="card">
      <h3>Завершенные</h3>
      <p style={{ fontSize: 24, fontWeight: 'bold', color: 'var(--accent)' }}>
        {payments.filter(p => p.status === 'completed').length}
      </p>
    </div>
    <div className="card">
      <h3>Ожидающие</h3>
      <p style={{ fontSize: 24, fontWeight: 'bold', color: 'var(--accent)' }}>
        {payments.filter(p => p.status === 'pending').length}
      </p>
    </div>
  </div>

  <div className="card">
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ borderBottom: '1px solid #e6eef6' }}>
          <th style={{ textAlign: 'left', padding: '12px' }}>ID</th>
          <th style={{ textAlign: 'left', padding: '12px' }}>ID заказа</th>
          <th style={{ textAlign: 'left', padding: '12px' }}>Пользователь</th>
          <th style={{ textAlign: 'left', padding: '12px' }}>Сумма</th>
          <th style={{ textAlign: 'left', padding: '12px' }}>Комиссия</th>
          <th style={{ textAlign: 'left', padding: '12px' }}>Метод</th>
          <th style={{ textAlign: 'left', padding: '12px' }}>Статус</th>
          <th style={{ textAlign: 'left', padding: '12px' }}>Дата</th>
        </tr>
      </thead>
      <tbody>
        {payments.map(payment => (
          <tr key={payment.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
            <td style={{ padding: '12px' }}>#{payment.id}</td>
            <td style={{ padding: '12px' }}>#{payment.orderId}</td>
            <td style={{ padding: '12px' }}>{payment.user}</td>
            <td style={{ padding: '12px', fontWeight: 'bold' }}>{payment.amount}</td>
            <td style={{ padding: '12px', color: '#6b7280' }}>{payment.commission}</td>
            <td style={{ padding: '12px' }}>{payment.method}</td>
            <td style={{ padding: '12px' }}>
              <span style={{ 
                padding: '4px 8px', 
                borderRadius: '4px', 
                fontSize: '12px',
                background: getStatusColor(payment.status),
                color: 'white'
              }}>
                {getStatusText(payment.status)}
              </span>
            </td>
            <td style={{ padding: '12px' }}>{payment.date}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>
);
};

export default Payments;