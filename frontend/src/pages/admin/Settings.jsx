import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { settingsAPI } from '../../index';

export default function Settings({ userRole }) {
  const { t } = useTranslation();
  const [settings, setSettings] = useState({ siteName: '', contactEmail: '', maintenanceMode: false });
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

  const updateSettings = async () => {
    if (!isSuperAdmin) return;
    try {
      await settingsAPI.update(settings);
      alert(t('settings_updated'));
    } catch (err) {
      setError(err.message);
    }
  };

  if (!isSuperAdmin) return <div>{t('access_denied')}</div>;
  if (loading) return <div className="text-center">{t('loading')}</div>;
  if (error) return <div className="text-red-500">{t('error')}: {error}</div>;

  return (
    <div>
      <h2 className="text-2xl mb-4">{t('settings')}</h2>
      <div className="card max-w-lg">
        <div className="mb-4">
          <label className="block mb-1">{t('site_name')}</label>
          <input
            className="input"
            value={settings.siteName}
            onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">{t('contact_email')}</label>
          <input
            className="input"
            value={settings.contactEmail}
            onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
          />
        </div>
        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.maintenanceMode}
              onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
            />
            <span className="ml-2">{t('maintenance_mode')}</span>
          </label>
        </div>
        <button className="btn" onClick={updateSettings}>{t('save')}</button>
      </div>
    </div>
  );
}