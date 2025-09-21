import React, { useState } from 'react';

const Tariffs = ({ userRole }) => {
  const [tariffs, setTariffs] = useState([
    { id: 1, from: 'Алматы', to: 'Москва', pricePerKm: '50 ₸', minPrice: '100 000 ₸', distance: '2000 км', duration: '3 дня' },
    { id: 2, from: 'Нур-Султан', to: 'Санкт-Петербург', pricePerKm: '55 ₸', minPrice: '110 000 ₸', distance: '2100 км', duration: '4 дня' },
    { id: 3, from: 'Алматы', to: 'Бишкек', pricePerKm: '30 ₸', minPrice: '60 000 ₸', distance: '250 км', duration: '1 день' },
    { id: 4, from: 'Шымкент', to: 'Ташкент', pricePerKm: '25 ₸', minPrice: '50 000 ₸', distance: '180 км', duration: '1 день' },
  ]);

  const [newTariff, setNewTariff] = useState({
    from: '',
    to: '',
    pricePerKm: '',
    minPrice: '',
    distance: '',
    duration: ''
  });

  const canEdit = ['superadmin', 'admin'].includes(userRole);

  const addTariff = () => {
    if (newTariff.from && newTariff.to && newTariff.pricePerKm && newTariff.minPrice) {
      setTariffs([...tariffs, { ...newTariff, id: tariffs.length + 1 }]);
      setNewTariff({ from: '', to: '', pricePerKm: '', minPrice: '', distance: '', duration: '' });
    }
  };

  const deleteTariff = (id) => {
    setTariffs(tariffs.filter(tariff => tariff.id !== id));
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2>Тарифы</h2>
      </div>

      {canEdit && (
        <div className="card" style={{ marginBottom: 20 }}>
          <h3>Добавить новый тариф</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr auto', gap: '10px', alignItems: 'end' }}>
            <div>
              <label>Откуда</label>
              <input 
                type="text" 
                value={newTariff.from} 
                onChange={(e) => setNewTariff({...newTariff, from: e.target.value})} 
                className="input" 
                placeholder="Город отправления"
              />
            </div>
            <div>
              <label>Куда</label>
              <input 
                type="text" 
                value={newTariff.to} 
                onChange={(e) => setNewTariff({...newTariff, to: e.target.value})} 
                className="input" 
                placeholder="Город назначения"
              />
            </div>
            <div>
              <label>Цена за км</label>
              <input 
                type="text" 
                value={newTariff.pricePerKm} 
                onChange={(e) => setNewTariff({...newTariff, pricePerKm: e.target.value})} 
                className="input" 
                placeholder="50 ₸"
              />
            </div>
            <div>
              <label>Минимальная цена</label>
              <input 
                type="text" 
                value={newTariff.minPrice} 
                onChange={(e) => setNewTariff({...newTariff, minPrice: e.target.value})} 
                className="input" 
                placeholder="100 000 ₸"
              />
            </div>
            <div>
              <label>Расстояние</label>
              <input 
                type="text" 
                value={newTariff.distance} 
                onChange={(e) => setNewTariff({...newTariff, distance: e.target.value})} 
                className="input" 
                placeholder="2000 км"
              />
            </div>
            <div>
              <label>Длительность</label>
              <input 
                type="text" 
                value={newTariff.duration} 
                onChange={(e) => setNewTariff({...newTariff, duration: e.target.value})} 
                className="input" 
                placeholder="3 дня"
              />
            </div>
            <button className="btn" onClick={addTariff}>Добавить</button>
          </div>
        </div>
      )}

      <div className="card">
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #e6eef6' }}>
              <th style={{ textAlign: 'left', padding: '12px' }}>ID</th>
              <th style={{ textAlign: 'left', padding: '12px' }}>Маршрут</th>
              <th style={{ textAlign: 'left', padding: '12px' }}>Расстояние</th>
              <th style={{ textAlign: 'left', padding: '12px' }}>Длительность</th>
              <th style={{ textAlign: 'left', padding: '12px' }}>Цена за км</th>
              <th style={{ textAlign: 'left', padding: '12px' }}>Минимальная цена</th>
              {canEdit && <th style={{ textAlign: 'left', padding: '12px' }}>Действия</th>}
            </tr>
          </thead>
          <tbody>
            {tariffs.map(tariff => (
              <tr key={tariff.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                <td style={{ padding: '12px' }}>{tariff.id}</td>
                <td style={{ padding: '12px' }}>{tariff.from} → {tariff.to}</td>
                <td style={{ padding: '12px' }}>{tariff.distance}</td>
                <td style={{ padding: '12px' }}>{tariff.duration}</td>
                <td style={{ padding: '12px' }}>{tariff.pricePerKm}</td>
                <td style={{ padding: '12px' }}>{tariff.minPrice}</td>
                {canEdit && (
                  <td style={{ padding: '12px' }}>
                    <button 
                      style={{ padding: '6px 12px', background: '#f87171', color: 'white', border: 'none', borderRadius: '4px', fontSize: '12px' }}
                      onClick={() => deleteTariff(tariff.id)}
                    >
                      Удалить
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

export default Tariffs;