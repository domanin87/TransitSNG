import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { driversAPI } from '../../index';

export default function Drivers({ userRole }) {
  const { t } = useTranslation();
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDrivers, setSelectedDrivers] = useState([]);
  const [editingDriver, setEditingDriver] = useState(null);
  const [newDriver, setNewDriver] = useState({ name: '', email: '', phone: '', status: 'active' });

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

  const addDriver = async () => {
    if (!canEdit) return;
    try {
      const data = await driversAPI.create(newDriver);
      setDrivers([...drivers, data]);
      setNewDriver({ name: '', email: '', phone: '', status: 'active' });
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
              placeholder={t('name')}
              value={newDriver.name}
              onChange={(e) => setNewDriver({ ...newDriver, name: e.target.value })}
            />
            <input
              className="input"
              placeholder={t('email')}
              type="email"
              value={newDriver.email}
              onChange={(e) => setNewDriver({ ...newDriver, email: e.target.value })}
            />
            <input
              className="input"
              placeholder={t('phone')}
              value={newDriver.phone}
              onChange={(e) => setNewDriver({ ...newDriver, phone: e.target.value })}
            />
            <button className="btn" onClick={addDriver}>{t('add')}</button>
          </div>
        </div>
      )}
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left p-3">
              <input
                type="checkbox"
                onChange={(e) => setSelectedDrivers(e.target.checked ? drivers.map((d) => d.id) : [])}
                checked={selectedDrivers.length === drivers.length && drivers.length > 0}
              />
            </th>
            <th className="text-left p-3">{t('id')}</th>
            <th className="text-left p-3">{t('name')}</th>
            <th className="text-left p-3">{t('email')}</th>
            <th className="text-left p-3">{t('phone')}</th>
            <th className="text-left p-3">{t('status')}</th>
            {canEdit && <th className="text-left p-3">{t('actions')}</th>}
          </tr>
        </thead>
        <tbody>
          {drivers.map((driver) => (
            <tr key={driver.id} className="border-b border-gray-200">
              <td className="p-3">
                <input
                  type="checkbox"
                  checked={selectedDrivers.includes(driver.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedDrivers([...selectedDrivers, driver.id]);
                    } else {
                      setSelectedDrivers(selectedDrivers.filter((id) => id !== driver.id));
                    }
                  }}
                />
              </td>
              <td className="p-3">{driver.id}</td>
              <td className="p-3">
                {editingDriver === driver.id ? (
                  <input
                    className="input"
                    value={driver.name}
                    onChange={(e) => updateDriver(driver.id, { ...driver, name: e.target.value })}
                  />
                ) : (
                  driver.name
                )}
              </td>
              <td className="p-3">
                {editingDriver === driver.id ? (
                  <input
                    className="input"
                    value={driver.email}
                    type="email"
                    onChange={(e) => updateDriver(driver.id, { ...driver, email: e.target.value })}
                  />
                ) : (
                  driver.email
                )}
              </td>
              <td className="p-3">
                {editingDriver === driver.id ? (
                  <input
                    className="input"
                    value={driver.phone}
                    onChange={(e) => updateDriver(driver.id, { ...driver, phone: e.target.value })}
                  />
                ) : (
                  driver.phone
                )}
              </td>
              <td className="p-3">{driver.status}</td>
              {canEdit && (
                <td className="p-3">
                  {editingDriver === driver.id ? (
                    <button className="btn small" onClick={() => setEditingDriver(null)}>{t('save')}</button>
                  ) : (
                    <>
                      <button className="btn small mr-2" onClick={() => setEditingDriver(driver.id)}>{t('edit')}</button>
                      <button className="btn small red" onClick={() => deleteDriver(driver.id)}>{t('delete')}</button>
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