import React, { useState, useEffect } from 'react';
import { settingsAPI } from '../../api';

const Settings = ({ userRole }) => {
  const [settings, setSettings] = useState({
    siteName: '',
    adminEmail: '',
    supportEmail: '',
    defaultLanguage: 'ru',
    trialPeriod: 14,
    commissionRate: 5,
    currency: '₸',
    smsNotifications: true,
    emailNotifications: true
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isSuperAdmin = userRole === 'superadmin';

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const data = await settingsAPI.get();
      setSettings(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      await settingsAPI.update(settings);
      alert('Настройки сохранены!');
    } catch (err) {
      setError(err.message);
    }
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

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;

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
            <label>Email поддержки</label>
            <input 
              type="email" 
              value={settings.supportEmail} 
              onChange={(e) => setSettings({...settings, supportEmail: e.target.value})} 
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
          <div>
            <label>Валюта</label>
            <select 
              value={settings.currency} 
              onChange={(e) => setSettings({...settings, currency: e.target.value})} 
              className="input"
            >
              <option value="₸">Тенге (₸)</option>
              <option value="₽">Рубль (₽)</option>
              <option value="$">Доллар ($)</option>
              <option value="€">Евро (€)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <h3>Уведомления</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h4>SMS уведомления</h4>
              <p style={{ fontSize: '14px', color: '#6b7280' }}>Включить отправку SMS уведомлений пользователям</p>
            </div>
            <label style={{ position: 'relative', display: 'inline-block', width: '50px', height: '24px' }}>
              <input 
                type="checkbox" 
                checked={settings.smsNotifications} 
                onChange={(e) => setSettings({...settings, smsNotifications: e.target.checked})} 
                style={{ opacity: 0, width: 0, height: 0 }}
              />
              <span style={{
                position: 'absolute',
                cursor: 'pointer',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: settings.smsNotifications ? '#4ade80' : '#ccc',
                transition: '.4s',
                borderRadius: '24px'
              }}>
                <span style={{
                  position: 'absolute',
                  content: '',
                  height: '18px',
                  width: '18px',
                  left: settings.smsNotifications ? '26px' : '3px',
                  bottom: '3px',
                  backgroundColor: 'white',
                  transition: '.4s',
                  borderRadius: '50%'
                }} />
              </span>
            </label>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h4>Email уведомления</h4>
              <p style={{ fontSize: '14px', color: '#6b7280' }}>Включить отправку email уведомлений пользователям</p>
            </div>
            <label style={{ position: 'relative', display: 'inline-block', width: '50px', height: '24px' }}>
              <input 
                type="checkbox" 
                checked={settings.emailNotifications} 
                onChange={(e) => setSettings({...settings, emailNotifications: e.target.checked})} 
                style={{ opacity: 0, width: 0, height: 0 }}
              />
              <span style={{
                position: 'absolute',
                cursor: 'pointer',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: settings.emailNotifications ? '#4ade80' : '#ccc',
                transition: '.4s',
                borderRadius: '24px'
              }}>
                <span style={{
                  position: 'absolute',
                  content: '',
                  height: '18px',
                  width: '18px',
                  left: settings.emailNotifications ? '26px' : '3px',
                  bottom: '3px',
                  backgroundColor: 'white',
                  transition: '.4s',
                  borderRadius: '50%'
                }} />
              </span>
            </label>
          </div>
        </div>
      </div>

      <div style={{ textAlign: 'right', marginBottom: 20 }}>
        <button className="btn" onClick={saveSettings}>Сохранить настройки</button>
      </div>

      <div className="card">
        <h3>Опасная зона</h3>
        <p style={{ marginBottom: '15px', color: '#6b7280' }}>Эти действия не могут быть отменены. Будьте осторожны.</p>
        <div style={{ display: 'flex', gap: '10px' }}>
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