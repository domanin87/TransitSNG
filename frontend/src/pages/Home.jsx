import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Typeahead from '../components/Typeahead';
import ServiceList from '../components/ServiceList';
import { apiRequest } from '../index';

export default function Home({ user }) {
  const { t } = useTranslation();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [items, setItems] = useState([]);
  const [logged, setLogged] = useState(!!user);
  const [news, setNews] = useState([
    { id: 1, title: t('news.new_service'), date: '2025-09-15', content: t('news.new_service_content') },
    { id: 2, title: t('news.tariff_update'), date: '2025-09-10', content: t('news.tariff_update_content') },
  ]);
  const [vacancies, setVacancies] = useState([
    { id: 1, title: t('vacancies.driver'), location: 'Алматы', description: t('vacancies.driver_desc') },
    { id: 2, title: t('vacancies.manager'), location: 'Москва', description: t('vacancies.manager_desc') },
  ]);

  useEffect(() => {
    setLogged(!!user);
    loadOrders();
  }, [user]);

  const loadOrders = async () => {
    try {
      const data = await apiRequest('/orders');
      setItems(data.slice(0, 6));
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
      setItems(filtered.slice(0, 6));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container">
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

      <h2 className="mt-6 text-2xl">{t('active_orders')}</h2>
      <ServiceList items={items} logged={logged} />

      <h2 className="mt-6 text-2xl">{t('news')}</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {news.map((item) => (
          <div key={item.id} className="news-item">
            <h3 className="text-lg font-semibold">{item.title}</h3>
            <p className="meta">{item.date}</p>
            <p>{item.content}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-6 text-2xl">{t('vacancies')}</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {vacancies.map((item) => (
          <div key={item.id} className="vacancy-item">
            <h3 className="text-lg font-semibold">{item.title}</h3>
            <p className="meta">{item.location}</p>
            <p>{item.description}</p>
          </div>
        ))}
      </div>

      {!logged && (
        <div className="mt-10 text-center p-5 bg-card rounded-lg">
          <h3 className="text-xl">{t('join_community')}</h3>
          <p className="meta">{t('join_community_desc')}</p>
          <div className="mt-5">
            <Link to="/register" className="btn mr-2">{t('register')}</Link>
            <Link to="/login" className="btn bg-gray-500">{t('login')}</Link>
          </div>
        </div>
      )}
    </div>
  );
}