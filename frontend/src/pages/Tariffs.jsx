import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { tariffsAPI } from '../index';

export default function Tariffs({ userRole }) {
  const { t } = useTranslation();
  const [tariffs, setTariffs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTariffs, setSelectedTariffs] = useState([]);
  const [editingTariff, setEditingTariff] = useState(null);
  const [newTariff, setNewTariff] = useState({ name: '', price: '', description: '' });

  const canEdit = ['superadmin', 'admin', 'moderator'].includes(userRole);

  useEffect(() => {
    loadTariffs();
  }, []);

  const loadTariffs = async () => {
    try {
      setLoading(true);
      const data = await tariffsAPI.getAll();
      setTariffs(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addTariff = async () => {
    if (!canEdit) return;
    try {
      const data = await tariffsAPI.create(newTariff);
      setTariffs([...tariffs, data]);
      setNewTariff({ name: '', price: '', description: '' });
    } catch (err) {
      setError(err.message);
    }
  };

  const updateTariff = async (id, updatedData) => {
    if (!canEdit) return;
    try {
      const data = await tariffsAPI.update(id, updatedData);
      setTariffs(tariffs.map((tariff) => (tariff.id === id ? data : tariff)));
      setEditingTariff(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteTariff = async (id) => {
    if (!canEdit) return;
    try {
      await tariffsAPI.delete(id);
      setTariffs(tariffs.filter((tariff) => tariff.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="text-center">{t('loading')}</div>;
  if (error) return <div className="text-red-500">{t('error')}: {error}</div>;

  return (
    <div>
      <h2 className="text-2xl mb-4">{t('tariffs')}</h2>
      {canEdit && (
        <div className="card mb-5">
          <h3 className="text-lg mb-2">{t('add_tariff')}</h3>
          <div className="grid gap-2">
            <input
              className="input"
              placeholder={t('name')}
              value={newTariff.name}
              onChange={(e) => setNewTariff({ ...newTariff, name: e.target.value })}
            />
            <input
              className="input"
              placeholder={t('price')}
              type="number"
              value={newTariff.price}
              onChange={(e) => setNewTariff({ ...newTariff, price: e.target.value })}
            />
            <input
              className="input"
              placeholder={t('description')}
              value={newTariff.description}
              onChange={(e) => setNewTariff({ ...newTariff, description: e.target.value })}
            />
            <button className="btn" onClick={addTariff}>{t('add')}</button>
          </div>
        </div>
      )}
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left p-3">
              <input
                type="checkbox"
                onChange={(e) => setSelectedTariffs(e.target.checked ? tariffs.map((t) => t.id) : [])}
                checked={selectedTariffs.length === tariffs.length && tariffs.length > 0}
              />
            </th>
            <th className="text-left p-3">{t('id')}</th>
            <th className="text-left p-3">{t('name')}</th>
            <th className="text-left p-3">{t('price')}</th>
            <th className="text-left p-3">{t('description')}</th>
            {canEdit && <th className="text-left p-3">{t('actions')}</th>}
          </tr>
        </thead>
        <tbody>
          {tariffs.map((tariff) => (
            <tr key={tariff.id} className="border-b border-gray-200">
              <td className="p-3">
                <input
                  type="checkbox"
                  checked={selectedTariffs.includes(tariff.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedTariffs([...selectedTariffs, tariff.id]);
                    } else {
                      setSelectedTariffs(selectedTariffs.filter((id) => id !== tariff.id));
                    }
                  }}
                />
              </td>
              <td className="p-3">{tariff.id}</td>
              <td className="p-3">
                {editingTariff === tariff.id ? (
                  <input
                    className="input"
                    value={tariff.name}
                    onChange={(e) => updateTariff(tariff.id, { ...tariff, name: e.target.value })}
                  />
                ) : (
                  tariff.name
                )}
              </td>
              <td className="p-3">
                {editingTariff === tariff.id ? (
                  <input
                    className="input"
                    value={tariff.price}
                    type="number"
                    onChange={(e) => updateTariff(tariff.id, { ...tariff, price: e.target.value })}
                  />
                ) : (
                  tariff.price
                )}
              </td>
              <td className="p-3">
                {editingTariff === tariff.id ? (
                  <input
                    className="input"
                    value={tariff.description}
                    onChange={(e) => updateTariff(tariff.id, { ...tariff, description: e.target.value })}
                  />
                ) : (
                  tariff.description
                )}
              </td>
              {canEdit && (
                <td className="p-3">
                  {editingTariff === tariff.id ? (
                    <button className="btn small" onClick={() => setEditingTariff(null)}>{t('save')}</button>
                  ) : (
                    <>
                      <button className="btn small mr-2" onClick={() => setEditingTariff(tariff.id)}>{t('edit')}</button>
                      <button className="btn small red" onClick={() => deleteTariff(tariff.id)}>{t('delete')}</button>
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