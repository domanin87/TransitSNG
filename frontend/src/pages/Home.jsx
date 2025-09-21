import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { apiRequest } from '../index';
import Typeahead from '../components/Typeahead';
import ServiceList from '../components/ServiceList';

export default function Home({ user }) {
  const { t } = useTranslation();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const data = await apiRequest('get', '/services');
        setServices(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  if (loading) return <div className="text-center">{t('loading')}</div>;
  if (error) return <div className="text-red-500">{t('error')}: {error}</div>;

  return (
    <div>
      <h1 className="text-3xl mb-4">{t('welcome')}</h1>
      <Typeahead
        className="input mb-4"
        placeholder={t('search_services')}
        onChange={(val) => console.log('Search:', val)}
      />
      <ServiceList services={services} />
    </div>
  );
}