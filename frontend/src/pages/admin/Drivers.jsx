import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { driversAPI } from '../../index';

export default function Drivers({ userRole }) {
  const { t } = useTranslation();
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingDriver, setEditingDriver] = useState(null);
  const [newDriver, setNewDriver] = useState({ userId: '', license: '', vehicleType: '', status: 'pending' });

  const canEdit = ['superadmin', 'admin'].includes(userRole);
  const canVerify = ['superadmin', 'admin', 'moderator'].includes(userRole);

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

  const addDriver = async () => {
    if (!canEdit) return;
    try {
      const data = await driversAPI.create(newDriver);
      setDrivers([...drivers, data]);
      setNewDriver({ userId: '', license: '', vehicleType: '', status: 'pending' });
    } catch (err) {
      setError(err.message);
    }
  };

  const updateDriver = async (id, updatedData) => {
    if (!canEdit) return;
    try {
      const data = await driversAPI.update(id, updatedData);
      setDrivers(drivers.map((driver) => (driver.id === id ? data : driver)));
      setEditingDriver(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteDriver = async (id) => {
    if (!canEdit) return;
    try {
      await driversAPI.delete(id);
      setDrivers(drivers.filter((driver) => driver.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const verifyDriver = async (id) => {
    if (!canVerify) return;
    try {
      await driversAPI.verify(id);
      loadDrivers();
    } catch (err) {
      setError(err.message);
    }
  };

  const rejectDriver = async (id) => {
    if (!canVerify) return;
    try {
      await driversAPI.reject(id);
      loadDrivers();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="text-center">{t('loading')}</div>;
  if (error) return <div className="text-red-500">{t('error')}: {error}</div>;

  return (
    <div>
      <h2 className="text-2xl mb-4">{t('drivers')}</h2>
      {canEdit && (
        <div className="card mb-5">
          <h3 className="text-lg mb-2">{t('add_driver')}</h3>
          <div className="grid gap-2">
            <input
              className="input"
              placeholder={t('user_id')}
              value={newDriver.userId}
              onChange={(e) => setNewDriver({ ...newDriver, userId: e.target.value })}
            />
            <input
              className="input"
              placeholder={t('license')}
              value={newDriver.license}
              onChange={(e) => setNewDriver({ ...newDriver, license: e.target.value })}
            />
            <input
              className="input"
              placeholder={t('vehicle_type')}
              value={newDriver.vehicleType}
              onChange={(e) => setNewDriver({ ...newDriver, vehicleType: e.target.value })}
            />
            <button className="btn" onClick={addDriver}>{t('add')}</button>
          </div>
        </div>
      )}
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left p-3">{t('id')}</th>
            <th className="text-left p-3">{t('user_id')}</th>
            <th className="text-left p-3">{t('license')}</th>
            <th className="text-left p-3">{t('vehicle_type')}</th>
            <th className="text-left p-3">{t('status')}</th>
            {(canEdit || canVerify) && <th className="text-left p-3">{t('actions')}</th>}
          </tr>
        </thead>
        <tbody>
          {drivers.map((driver) => (
            <tr key={driver.id} className="border-b border-gray-200">
              <td className="p-3">{driver.id}</td>
              <td className="p-3">
                {editingDriver === driver.id ? (
                  <input
                    className="input"
                    value={driver.user_id}
                    onChange={(e) => updateDriver(driver.id, { ...driver, user_id: e.target.value })}
                  />
                ) : (
                  driver.user_id
                )}
              </td>
              <td className="p-3">
                {editingDriver === driver.id ? (
                  <input
                    className="input"
                    value={driver.license}
                    onChange={(e) => updateDriver(driver.id, { ...driver, license: e.target.value })}
                  />
                ) : (
                  driver.license
                )}
              </td>
              <td className="p-3">
                {editingDriver === driver.id ? (
                  <input
                    className="input"
                    value={driver.vehicle_type}
                    onChange={(e) => updateDriver(driver.id, { ...driver, vehicle_type: e.target.value })}
                  />
                ) : (
                  driver.vehicle_type
                )}
              </td>
              <td className="p-3">{driver.status}</td>
              {(canEdit || canVerify) && (
                <td className="p-3">
                  {editingDriver === driver.id ? (
                    <button className="btn small" onClick={() => setEditingDriver(null)}>{t('save')}</button>
                  ) : (
                    <>
                      {canEdit && (
                        <>
                          <button className="btn small mr-2" onClick={() => setEditingDriver(driver.id)}>{t('edit')}</button>
                          <button className="btn small red" onClick={() => deleteDriver(driver.id)}>{t('delete')}</button>
                        </>
                      )}
                      {canVerify && (
                        <>
                          <button className="btn small mr-2" onClick={() => verifyDriver(driver.id)}>{t('approve')}</button>
                          <button className="btn small red" onClick={() => rejectDriver(driver.id)}>{t('reject')}</button>
                        </>
                      )}
                    </>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}