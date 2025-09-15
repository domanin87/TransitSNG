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
date: '2023-10-15'
},
{
id: 5002,
orderId: 1002,
user: 'Петр Петров',
amount: '150 000 ₸',
method: 'Перевод',
status: 'pending',
date: '2023-10-16'
},
]);

return (
<div>
<h2>Платежи</h2>
<div className="card">
<table style={{ width: '100%', borderCollapse: 'collapse' }}>
<thead>
<tr style={{ borderBottom: '1px solid #e6eef6' }}>
<th style={{ textAlign: 'left', padding: '12px' }}>ID</th>
<th style={{ textAlign: 'left', padding: '12px' }}>ID заказа</th>
<th style={{ textAlign: 'left', padding: '12px' }}>Пользователь</th>
<th style={{ textAlign: 'left', padding: '12px' }}>Сумма</th>
<th style={{ textAlign: 'left', padding: '12px' }}>Метод</th>
<th style={{ textAlign: 'left', padding: '12px' }}>Статус</th>
<th style={{ textAlign: 'left', padding: '12px' }}>Дата</th>
</tr>
</thead>
<tbody>
{payments.map(payment => (
<tr key={payment.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
<td style={{ padding: '12px' }}>{payment.id}</td>
<td style={{ padding: '12px' }}>{payment.orderId}</td>
<td style={{ padding: '12px' }}>{payment.user}</td>
<td style={{ padding: '12px' }}>{payment.amount}</td>
<td style={{ padding: '12px' }}>{payment.method}</td>
<td style={{ padding: '12px' }}>{payment.status}</td>
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