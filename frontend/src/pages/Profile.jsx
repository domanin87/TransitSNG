import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { profileAPI } from '../index';

export default function Profile({ user }) {
  const { t } = useTranslation();
  const [profile, setProfile] = useState({ name: '', email: '', phone: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await profileAPI.getProfile();
      setProfile(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    try {
      const data = await profileAPI.updateProfile(profile);
      setProfile(data);
      setIsEditing(false);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="text-center">{t('loading')}</div>;
  if (error) return <div className="text-red-500">{t('error')}: {error}</div>;

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="card w-96">
        <h2 className="text-2xl mb-4">{t('profile')}</h2>
        <div className="grid gap-2">
          <input
            className="input"
            placeholder={t('name')}
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            disabled={!isEditing}
          />
          <input
            className="input"
            placeholder={t('email')}
            type="email"
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            disabled={!isEditing}
          />
          <input
            className="input"
            placeholder={t('phone')}
            value={profile.phone}
            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            disabled={!isEditing}
          />
          {isEditing ? (
            <>
              <button className="btn" onClick={updateProfile}>{t('save')}</button>
              <button className="btn red" onClick={() => setIsEditing(false)}>{t('cancel')}</button>
            </>
          ) : (
            <button className="btn" onClick={() => setIsEditing(true)}>{t('edit')}</button>
          )}
        </div>
      </div>
    </div>
  );
}