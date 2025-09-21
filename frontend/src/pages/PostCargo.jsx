import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Typeahead from '../components/Typeahead';
import { ordersAPI } from '../index';

export default function PostCargo() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ fromCity: '', toCity: '', cargoType: '', weight: '', price: '', status: 'pending' });
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    try {
      await ordersAPI.create(formData);
      navigate('/services');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container max-w-md">
      <h2 className="text-2xl mb-4">{t('post_cargo')}</h2>
      <div className="card">
        {error && <div className="text-red-500 mb-4">{t('error')}: {error}</div>}
        <div className="grid gap-2">
          <Typeahead
            className="input"
            placeholder={t('from')}
            value={formData.fromCity}
            onChange={(val) => setFormData({ ...formData, fromCity: val })}
          />
          <Typeahead
            className="input"
            placeholder={t('to')}
            value={formData.toCity}
            onChange={(val) => setFormData({ ...formData, toCity: val })}
          />
          <input
            className="input"
            placeholder={t('cargo_type')}
            value={formData.cargoType}
            onChange={(e) => setFormData({ ...formData, cargoType: e.target.value })}
          />
          <input
            className="input"
            placeholder={t('weight')}
            type="number"
            value={formData.weight}
            onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
          />
          <input
            className="input"
            placeholder={t('price')}
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          />
          <button className="btn" onClick={handleSubmit}>{t('post')}</button>
        </div>
      </div>
    </div>
  );
}