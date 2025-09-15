import React, { useState } from 'react';

const Settings = ({ userRole }) => {
const [settings, setSettings] = useState({
siteName: 'Транзит СНГ',
adminEmail: 'admin@transitsng.ru',
defaultLanguage: 'ru',
trialPeriod: 14,
commissionRate: 5
});

const isSuperAdmin = userRole === 'superadmin';

const saveSettings = () => {
// Здесь будет логика сохранения настроек
alert('Настройки сохранены!');
};

if (!isSuperAdmin) {
return (
<div>
<h2>Настройки</h2>
<div className="card">
<p>У вас нет прав для доступа к этому разделу.</p>
</div>
</div>
);
}

return (
<div>
<h2>Настройки системы</h2>
  <div className="card" style={{ marginBottom: 20 }}>
    <h3>Основные настройки</h3>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
      <div>
        <label>Название сайта</label>
        <input 
          type="text" 
          value={settings.siteName} 
          onChange={(e) => setSettings({...settings, siteName: e.target.value})} 
          className="input" 
        />
      </div>
      <div>
        <label>Email администратора</label>
        <input 
          type="email" 
          value={settings.adminEmail} 
          onChange={(e) => setSettings({...settings, adminEmail: e.target.value})} 
          className="input" 
        />
      </div>
      <div>
        <label>Язык по умолчанию</label>
        <select 
          value={settings.defaultLanguage} 
          onChange={(e) => setSettings({...settings, defaultLanguage: e.target.value})} 
          className="input"
        >
          <option value="ru">Русский</option>
          <option value="kk">Казахский</option>
          <option value="en">Английский</option>
        </select>
      </div>
      <div>
        <label>Пробный период (дней)</label>
        <input 
          type="number" 
          value={settings.trialPeriod} 
          onChange={(e) => setSettings({...settings, trialPeriod: parseInt(e.target.value)})} 
          className="input" 
        />
      </div>
      <div>
        <label>Комиссия платформы (%)</label>
        <input 
          type="number" 
          value={settings.commissionRate} 
          onChange={(e) => setSettings({...settings, commissionRate: parseInt(e.target.value)})} 
          className="input" 
        />
      </div>
    </div>
    <div style={{ marginTop: 20, textAlign: 'right' }}>
      <button className="btn" onClick={saveSettings}>Сохранить настройки</button>
    </div>
  </div>

  <div className="card">
    <h3>Опасная зона</h3>
    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
      <button style={{ padding: '10px 15px', background: '#f87171', color: 'white', border: 'none', borderRadius: '6px' }}>
        Очистить кеш
      </button>
      <button style={{ padding: '10px 15px', background: '#f87171', color: 'white', border: 'none', borderRadius: '6px' }}>
        Экспорт данных
      </button>
      <button style={{ padding: '10px 15px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '6px' }}>
        Удалить все данные
      </button>
    </div>
  </div>
</div>
);
};

export default Settings;