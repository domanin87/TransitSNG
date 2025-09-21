import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { verificationsAPI } from '../../index';

export default function Verifications({ userRole }) {
  const { t } = useTranslation();
  const [verifications, setVerifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVerifications, setSelectedVerifications] = useState([]);
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
      const data = await verificationsAPI.approve(id, { status: 'approved' });
      setVerifications(verifications.map((v) => (v.id === id ? data : v)));
    } catch (err) {
      setError(err.message);
    }
  };

  const rejectVerification = async (id) => {
    if (!canEdit) return;
    try {
      const data = await verificationsAPI.reject(id, { status: 'rejected' });
      setVerifications(verifications.map((v) => (v.id === id ? data : v)));
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteVerification = async (id) => {
    if (!canEdit) return;
    try {
      await verificationsAPI.delete(id);
      setVerifications(verifications.filter((v) => v.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  if (!canEdit) return <div className="text-red-500">{t('access_denied')}</div>;
  if (loading) return <div className="text-center">{t('loading')}</div>;
  if (error) return <div className="text-red-500">{t('error')}: {error}</div>;

  return (
    <div>
      <h2 className="text-2xl mb-4">{t('verifications')}</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left p-3">
              <input
                type="checkbox"
                onChange={(e) => setSelectedVerifications(e.target.checked ? verifications.map((v) => v.id) : [])}
                checked={selectedVerifications.length === verifications.length && verifications.length > 0}
              />
            </th>
            <th className="text-left p-3">{t('id')}</th>
            <th className="text-left p-3">{t('user_id')}</th>
            <th className="text-left p-3">{t('type')}</th>
            <th className="text-left p-3">{t('status')}</th>
            <th className="text-left p-3">{t('submitted_at')}</th>
            {canEdit && <th className="text-left p-3">{t('actions')}</th>}
          </tr>
        </thead>
        <tbody>
          {verifications.map((verification) => (
            <tr key={verification.id} className="border-b border-gray-200">
              <td className="p-3">
                <input
                  type="checkbox"
                  checked={selectedVerifications.includes(verification.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedVerifications([...selectedVerifications, verification.id]);
                    } else {
                      setSelectedVerifications(selectedVerifications.filter((id) => id !== verification.id));
                    }
                  }}
                />
              </td>
              <td className="p-3">{verification.id}</td>
              <td className="p-3">{verification.userId}</td>
              <td className="p-3">{verification.type}</td>
              <td className="p-3">{verification.status}</td>
              <td className="p-3">{verification.submittedAt}</td>
              {canEdit && (
                <td className="p-3">
                  <button className="btn small mr-2" onClick={() => approveVerification(verification.id)}>
                    {t('approve')}
                  </button>
                  <button className="btn small red mr-2" onClick={() => rejectVerification(verification.id)}>
                    {t('reject')}
                  </button>
                  <button className="btn small red" onClick={() => deleteVerification(verification.id)}>
                    {t('delete')}
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}