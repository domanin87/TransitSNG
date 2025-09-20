import React, { useState, useEffect } from 'react';
import { driversAPI } from '../../api';

const Drivers = ({ userRole }) => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const canEdit = ['superadmin', 'admin', 'moderator'].includes(userRole);

  useEffect(() => {
    loadDrivers();
  }, []);

  const loadDrivers = async () => {
    try {
      setLoading(true);
      const data = await driversAPI.getAll();
      setDrivers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const verifyDriver = async (id) => {
    try {
      await driversAPI.verify(id);
      setDrivers(drivers.map(driver =>
        driver.id === id ? { ...driver, verification: 'approved', status: 'active' } : driver
      ));
    } catch (err) {
      setError(err.message);
    }
  };

  const rejectDriver = async (id) => {
    try {
      await driversAPI.reject(id);
      setDrivers(drivers.map(driver =>
        driver.id === id ? { ...driver, verification: 'rejected' } : driver
      ));
    } catch (err) {
      setError(err.message);
    }
  };

  const blockDriver = async (id) => {
    try {
      await driversAPI.update(id, { status: 'blocked' });
      setDrivers(drivers.map(driver =>
        driver.id === id ? { ...driver, status: 'blocked' } : driver
      ));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2>Водители</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            placeholder="Поиск водителей..."
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
              <th style={{ textAlign: 'left', padding: '12px' }}>Имя</th>
              <th style={{ textAlign: 'left', padding: '12px' }}>Контакты</th>
              <th style={{ textAlign: 'left', padding: '12px' }}>Водительское удостоверение</th>
              <th style={{ textAlign: 'left', padding: '12px' }}>Тип автомобиля</th>
              <th style={{ textAlign: 'left', padding: '12px' }}>Рейтинг</th>
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
                <td style={{ padding: '12px' }}>⭐ {driver.rating}</td>
                <td style={{ padding: '12px' }}>
                  <span style={{ 
                    padding: '4px 8px', 
                    borderRadius: '4px', 
                    fontSize: '12px',
                    background: driver.status === 'active' ? '#4ade80' : 
                               driver.status === 'pending' ? '#fbbf24' : '#f87171',
                    color: 'white'
                  }}>
                    {driver.status === 'active' ? 'Активен' : 
                     driver.status === 'pending' ? 'Ожидание' : 'Заблокирован'}
                  </span>
                </td>
                <td style={{ padding: '12px' }}>
                  <span style={{ 
                    padding: '4px 8px', 
                    borderRadius: '4px', 
                    fontSize: '12px',
                    background: driver.verification === 'approved' ? '#4ade80' : 
                               driver.verification === 'pending' ? '#fbbf24' : '#f87171',
                    color: 'white'
                  }}>
                    {driver.verification === 'approved' ? 'Подтвержден' : 
                     driver.verification === 'pending' ? 'Ожидание' : 'Отклонен'}
                  </span>
                </td>
                {canEdit && (
                  <td style={{ padding: '12px' }}>
                    {driver.verification === 'pending' && (
                      <>
                        <button 
                          style={{ marginRight: '8px', padding: '6px 12px', background: '#4ade80', color: 'white', border: 'none', borderRadius: '4px', fontSize: '12px' }}
                          onClick={() => verifyDriver(driver.id)}
                        >
                          Одобрить
                        </button>
                        <button 
                          style={{ marginRight: '8px', padding: '6px 12px', background: '#f87171', color: 'white', border: 'none', borderRadius: '4px', fontSize: '12px' }}
                          onClick={() => rejectDriver(driver.id)}
                        >
                          Отклонить
                        </button>
                      </>
                    )}
                    {driver.status === 'active' && (
                      <button 
                        style={{ padding: '6px 12px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', fontSize: '12px' }}
                        onClick={() => blockDriver(d极ver.id)}
                      >
                        Заблокировать
                      </button>
                    )}
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