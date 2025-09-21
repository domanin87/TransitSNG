import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { tariffsAPI } from '../../index';
import Typeahead from '../../components/Typeahead';

export default function Tariffs({ userRole }) {
  const { t } = useTranslation();
  const [tariffs, setTariffs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingTariff, setEditingTariff] = useState(null);
  const [newTariff, setNewTariff] = useState({ fromCity: '', toCity: '', pricePerKm: '', minPrice: '' });

  const canEdit = ['superadmin', 'admin'].includes(userRole);

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
      setNewTariff({ fromCity: '', toCity: '', pricePerKm: '', minPrice: '' });
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
            <Typeahead
              className="input"
              placeholder={t('from')}
              value={newTariff.fromCity}
              onChange={(val) => setNewTariff({ ...newTariff, fromCity: val })}
            />
            <Typeahead
              className="input"
              placeholder={t('to')}
              value={newTariff.toCity}
              onChange={(val) => setNewTariff({ ...newTariff, toCity: val })}
            />
            <input
              className="input"
              placeholder={t('price_per_km')}
              type="number"
              value={newTariff.pricePerKm}
              onChange={(e) => setNewTariff({ ...newTariff, pricePerKm: e.target.value })}
            />
            <input
              className="input"
              placeholder={t('min_price')}
              type="number"
              value={newTariff.minPrice}
              onChange={(e) => setNewTariff({ ...newTariff, minPrice: e.target.value })}
            />
            <button className="btn" onClick={addTariff}>{t('add')}</button>
          </div>
        </div>
      )}
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left p-3">{t('id')}</th>
            <th className="text-left p-3">{t('from')}</th>
            <th className="text-left p-3">{t('to')}</th>
            <th className="text-left p-3">{t('price_per_km')}</th>
            <th className="text-left p-3">{t('min_price')}</th>
            {canEdit && <th className="text-left p-3">{t('actions')}</th>}
          </tr>
        </thead>
        <tbody>
          {tariffs.map((tariff) => (
            <tr key={tariff.id} className="border-b border-gray-200">
              <td className="p-3">{tariff.id}</td>
              <td className="p-3">
                {editingTariff === tariff.id ? (
                  <Typeahead
                    className="input"
                    value={tariff.from_city}
                    onChange={(val) => updateTariff(tariff.id, { ...tariff, from_city: val })}
                  />
                ) : (
                  tariff.from_city
                )}
              </td>
              <td className="p-3">
                {editingTariff === tariff.id ? (
                  <Typeahead
                    className="input"
                    value={tariff.to_city}
                    onChange={(val) => updateTariff(tariff.id, { ...tariff, to_city: val })}
                  />
                ) : (
                  tariff.to_city
                )}
              </td>
              <td className="p-3">
                {editingTariff === tariff.id ? (
                  <input
                    className="input"
                    value={tariff.price_per_km}
                    onChange={(e) => updateTariff(tariff.id, { ...tariff, price_per_km: e.target.value })}
                  />
                ) : (
                  tariff.price_per_km
                )}
              </td>
              <td className="p-3">
                {editingTariff === tariff.id ? (
                  <input
                    className="input"
                    value={tariff.min_price}
                    onChange={(e) => updateTariff(tariff.id, { ...tariff, min_price: e.target.value })}
                  />
                ) : (
                  tariff.min_price
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