import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ServiceList from '../components/ServiceList';
import Typeahead from '../components/Typeahead';
import { apiRequest } from '../index';

export default function Services({ user }) {
  const { t } = useTranslation();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [items, setItems] = useState([]);
  const [logged, setLogged] = useState(!!user);

  useEffect(() => {
    setLogged(!!user);
    loadServices();
  }, [user]);

  const loadServices = async () => {
    try {
      const data = await apiRequest('/orders');
      setItems(data);
    } catch (err) {
      console.error(err);
    }
  };

  const onSearch = async () => {
    try {
      const data = await apiRequest('/orders');
      const filtered = data.filter((s) =>
        (!from || s.from_city.toLowerCase().includes(from.toLowerCase())) &&
        (!to || s.to_city.toLowerCase().includes(to.toLowerCase()))
      );
      setItems(filtered);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container">
      <h2 className="text-2xl mb-4">{t('services')}</h2>
      <div className="hero-search">
        <div className="search-panel">
          <div className="flex gap-2">
            <div className="flex-1"><Typeahead value={from} onChange={setFrom} placeholder={t('from')} /></div>
            <div className="flex-1"><Typeahead value={to} onChange={setTo} placeholder={t('to')} /></div>
            <input className="input small" type="date" />
            <button className="btn" onClick={onSearch}>{t('find')}</button>
          </div>
        </div>
      </div>
      <ServiceList items={items} logged={logged} />
    </div>
  );
}