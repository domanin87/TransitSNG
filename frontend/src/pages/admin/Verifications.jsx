import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { verificationsAPI } from '../../index';

export default function Verifications({ userRole }) {
  const { t } = useTranslation();
  const [verifications, setVerifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const canEdit = ['superadmin', 'admin', 'moderator'].includes(userRole);

  useEffect(() => {
    loadVerifications();
  }, []);

  const loadVerifications = async () => {
    try {
      setLoading(true);
      const data = await verificationsAPI.getAll();
      setVerifications(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const approveVerification = async (id) => {
    if (!canEdit) return;
    try {
      await verificationsAPI.approve(id);
      loadVerifications();
    } catch (err) {
      setError(err.message);
    }
  };

  const rejectVerification = async (id) => {
    if (!canEdit) return;
    try {
      await verificationsAPI.reject(id);
      loadVerifications();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="text-center">{t('loading')}</div>;
  if (error) return <div className="text-red-500">{t('error')}: {error}</div>;

  return (
    <div>
      <h2 className="text-2xl mb-4">{t('verifications')}</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left p-3">{t('id')}</th>
            <th className="text-left p-3">{t('driver_id')}</th>
            <th className="text-left p-3">{t('document')}</th>
            <th className="text-left p-3">{t('status')}</th>
            {canEdit && <th className="text-left p-3">{t('actions')}</th>}
          </tr>
        </thead>
        <tbody>
          {verifications.map((v) => (
            <tr key={v.id} className="border-b border-gray-200">
              <td className="p-3">{v.id}</td>
              <td className="p-3">{v.driver_id}</td>
              <td className="p-3">{v.document_type}</td>
              <td className="p-3">{v.status}</td>
              {canEdit && (
                <td className="p-3">
                  <button className="btn small mr-2" onClick={() => approveVerification(v.id)}>{t('approve')}</button>
                  <button className="btn small red" onClick={() => rejectVerification(v.id)}>{t('reject')}</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}