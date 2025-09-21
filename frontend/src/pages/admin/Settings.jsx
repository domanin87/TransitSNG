import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { settingsAPI } from '../../index';

export default function Settings({ userRole }) {
  const { t } = useTranslation();
  const [settings, setSettings] = useState({ siteName: '', currency: '', language: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const canEdit = ['superadmin', 'admin'].includes(userRole);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const data = await settingsAPI.getSettings();
      setSettings(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async () => {
    if (!canEdit) return;
    try {
      const data = await settingsAPI.updateSettings(settings);
      setSettings(data);
      setIsEditing(false);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="text-center">{t('loading')}</div>;
  if (error) return <div className="text-red-500">{t('error')}: {error}</div>;

  return (
    <div>
      <h2 className="text-2xl mb-4">{t('settings')}</h2>
      {canEdit && (
        <div className="card mb-5">
          <h3 className="text-lg mb-2">{t('site_settings')}</h3>
          <div className="grid gap-2">
            <input
              className="input"
              placeholder={t('site_name')}
              value={settings.siteName}
              onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
              disabled={!isEditing}
            />
            <input
              className="input"
              placeholder={t('currency')}
              value={settings.currency}
              onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
              disabled={!isEditing}
            />
            <input
              className="input"
              placeholder={t('language')}
              value={settings.language}
              onChange={(e) => setSettings({ ...settings, language: e.target.value })}
              disabled={!isEditing}
            />
            {isEditing ? (
              <>
                <button className="btn" onClick={updateSettings}>{t('save')}</button>
                <button className="btn red" onClick={() => setIsEditing(false)}>{t('cancel')}</button>
              </>
            ) : (
              <button className="btn" onClick={() => setIsEditing(true)}>{t('edit')}</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}