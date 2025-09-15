import React, { useState } from 'react';

const Orders = ({ userRole }) => {
const [orders, setOrders] = useState([
{
id: 1001,
from: 'Алматы',
to: 'Москва',
customer: 'Иван Иванов',
driver: 'Дмитрий Смирнов',
status: 'active',
price: '120 000 ₸',
date: '2023-10-15'
},
{
id: 1002,
from: 'Нур-Султан',
to: 'Санкт-Петербург',
customer: 'Петр Петров',
driver: 'Алексей Петров',
status: 'pending',
price: '150 000 ₸',
date: '2023-10-16'
},
]);

const canEdit = ['superadmin', 'admin', 'moderator'].includes(userRole);

const updateOrderStatus = (id, newStatus) => {
setOrders(orders.map(order =>
order.id === id ? { ...order, status: newStatus } : order
));
};

return (
<div>
<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
<h2>Заказы</h2>
</div>
  <div className="card">
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ borderBottom: '1px solid #e6eef6' }}>
          <th style={{ textAlign: 'left', padding: '12px' }}>ID</th>
          <th style={{ textAlign: 'left', padding: '12px' }}>Маршрут</th>
          <th style={{ textAlign: 'left', padding: '12px' }}>Заказчик</th>
          <th style={{ textAlign: 'left', padding: '12px' }}>Водитель</th>
          <th style={{ textAlign: 'left', padding: '12px' }}>Цена</th>
          <th style={{ textAlign: 'left', padding: '12px' }}>Дата</th>
          <th style={{ textAlign: 'left', padding: '12px' }}>Статус</th>
          {canEdit && <th style={{ textAlign: 'left', padding: '12px' }}>Действия</th>}
        </tr>
      </thead>
      <tbody>
        {orders.map(order => (
          <tr key={order.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
            <td style={{ padding: '12px' }}>{order.id}</td>
            <td style={{ padding: '12px' }}>{order.from} → {order.to}</td>
            <td style={{ padding: '12px' }}>{order.customer}</td>
            <td style={{ padding: '12px' }}>{order.driver}</td>
            <td style={{ padding: '12px' }}>{order.price}</td>
            <td style={{ padding: '12px' }}>{order.date}</td>
            <td style={{ padding: '12px' }}>{order.status}</td>
            {canEdit && (
              <td style={{ padding: '12px' }}>
                <select 
                  value={order.status} 
                  onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                  style={{ padding: '6px', borderRadius: '4px' }}
                >
                  <option value="pending">Ожидание</option>
                  <option value="active">Активный</option>
                  <option value="completed">Завершен</option>
                  <option value="cancelled">Отменен</option>
                </select>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

);
};

export default Orders;