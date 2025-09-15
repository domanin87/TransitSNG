import React, { useState } from 'react';

const Drivers = ({ userRole }) => {
const [drivers, setDrivers] = useState([
{
id: 1,
name: 'Алексей Петров',
email: 'alex@mail.com',
phone: '+7 777 111 2233',
status: 'pending',
regDate: '2023-05-15',
license: '1234567890',
truckType: 'Фура 20т',
verification: 'pending'
},
{
id: 2,
name: 'Дмитрий Смирнов',
email: 'dmitry@mail.com',
phone: '+7 777 444 5566',
status: 'active',
regDate: '2023-04-20',
license: '0987654321',
truckType: 'Рефрижератор 15т',
verification: 'approved'
},
]);

const canEdit = ['superadmin', 'admin', 'moderator'].includes(userRole);

const verifyDriver = (id) => {
setDrivers(drivers.map(driver =>
driver.id === id ? { ...driver, verification: 'approved', status: 'active' } : driver
));
};

const rejectDriver = (id) => {
setDrivers(drivers.map(driver =>
driver.id === id ? { ...driver, verification: 'rejected' } : driver
));
};

return (
<div>
<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
<h2>Водители</h2>
</div>
  <div className="card">
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ borderBottom: '1px solid #e6eef6' }}>
          <th style={{ textAlign: 'left', padding: '12px' }}>ID</th>
          <th style={{ textAlign: 'left', padding: '12px' }}>Имя</th>
          <th style={{ textAlign: 'left', padding: '12px' }}>Контакты</th>
          <th style={{ textAlign: 'left', padding: '12px' }}>Водительское удостоверение</th>
          <th style={{ textAlign: 'left', padding: '12px' }}>Тип автомобиля</th>
          <th style={{ textAlign: 'left', padding: '12px' }}>Статус</th>
          <th style={{ textAlign: 'left', padding: '12px' }}>Верификация</th>
          {canEdit && <th style={{ textAlign: 'left', padding: '12px' }}>Действия</th>}
        </tr>
      </thead>
      <tbody>
        {drivers.map(driver => (
          <tr key={driver.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
            <td style={{ padding: '12px' }}>{driver.id}</td>
            <td style={{ padding: '12px' }}>{driver.name}</td>
            <td style={{ padding: '12px' }}>
              <div>{driver.email}</div>
              <div>{driver.phone}</div>
            </td>
            <td style={{ padding: '12px' }}>{driver.license}</td>
            <td style={{ padding: '12px' }}>{driver.truckType}</td>
            <td style={{ padding: '12px' }}>{driver.status}</td>
            <td style={{ padding: '12px' }}>{driver.verification}</td>
            {canEdit && driver.verification === 'pending' && (
              <td style={{ padding: '12px' }}>
                <button 
                  style={{ marginRight: '8px', padding: '6px 12px', background: '#4ade80', color: 'white', border: 'none', borderRadius: '4px' }}
                  onClick={() => verifyDriver(driver.id)}
                >
                  Одобрить
                </button>
                <button 
                  style={{ padding: '6px 12px', background: '#f87171', color: 'white', border: 'none', borderRadius: '4px' }}
                  onClick={() => rejectDriver(driver.id)}
                >
                  Отклонить
                </button>
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

export default Drivers;