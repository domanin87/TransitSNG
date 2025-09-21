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
      date: '2023-10-15',
      cargoType: 'Бытовая техника',
      weight: '5 тонн'
    },
    {
      id: 1002,
      from: 'Нур-Султан',
      to: 'Санкт-Петербург',
      customer: 'Петр Петров',
      driver: 'Алексей Петров',
      status: 'pending',
      price: '150 000 ₸',
      date: '2023-10-16',
      cargoType: 'Одежда',
      weight: '3 тонны'
    },
    {
      id: 1003,
      from: 'Шымкент',
      to: 'Ташкент',
      customer: 'Сергей Сергеев',
      driver: '-',
      status: 'completed',
      price: '80 000 ₸',
      date: '2023-10-14',
      cargoType: 'Продукты',
      weight: '2 тонны'
    },
  ]);

  const canEdit = ['superadmin', 'admin', 'moderator'].includes(userRole);

  const updateOrderStatus = (id, newStatus) => {
    setOrders(orders.map(order =>
      order.id === id ? { ...order, status: newStatus } : order
    ));
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return '#4ade80';
      case 'pending': return '#fbbf24';
      case 'completed': return '#60a5fa';
      case 'cancelled': return '#f87171';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'active': return 'Активен';
      case 'pending': return 'Ожидание';
      case 'completed': return 'Завершен';
      case 'cancelled': return 'Отменен';
      default: return 'Неизвестно';
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2>Заказы</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <select className="input" style={{ width: '200px' }}>
            <option value="all">Все статусы</option>
            <option value="active">Активные</option>
            <option value="pending">Ожидающие</option>
            <option value="completed">Завершенные</option>
            <option value="cancelled">Отмененные</option>
          </select>
          <input
            type="text"
            placeholder="Поиск заказов..."
            className="input"
            style={{ width: '250px' }}
          />
          <button className="btn">Экспорт</button>
        </div>
      </div>

      <div className="card">
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #e6eef6' }}>
              <th style={{ textAlign: 'left', padding: '12px' }}>ID</th>
              <th style={{ textAlign: 'left', padding: '12px' }}>Маршрут</th>
              <th style={{ textAlign: 'left', padding: '12px' }}>Груз</th>
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
                <td style={{ padding: '12px' }}>#{order.id}</td>
                <td style={{ padding: '12px' }}>{order.from} → {order.to}</td>
                <td style={{ padding: '12px' }}>
                  <div>{order.cargoType}</div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>{order.weight}</div>
                </td>
                <td style={{ padding: '12px' }}>{order.customer}</td>
                <td style={{ padding: '12px' }}>{order.driver}</td>
                <td style={{ padding: '12px', fontWeight: 'bold' }}>{order.price}</td>
                <td style={{ padding: '12px' }}>{order.date}</td>
                <td style={{ padding: '12px' }}>
                  <span style={{ 
                    padding: '4px 8px', 
                    borderRadius: '4px', 
                    fontSize: '12px',
                    background: getStatusColor(order.status),
                    color: 'white'
                  }}>
                    {getStatusText(order.status)}
                  </span>
                </td>
                {canEdit && (
                  <td style={{ padding: '12px' }}>
                    <select 
                      value={order.status} 
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      style={{ padding: '6px', borderRadius: '4px', fontSize: '12px' }}
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