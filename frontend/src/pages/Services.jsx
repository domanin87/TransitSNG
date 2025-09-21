import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { apiRequest } from '../index';

export default function Services() {
  const { t } = useTranslation();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadServices = async () => {
      try {
        setLoading(true);
        const data = await apiRequest('GET', '/services');
        setServices(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadServices();
  }, []);

  if (loading) return <div className="text-center">{t('loading')}</div>;
  if (error) return <div className="text-red-500">{t('error')}: {error}</div>;

  return (
    <div>
      <h2 className="text-2xl mb-4">{t('services')}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service) => (
          <div key={service.id} className="card">
            <h3 className="text-lg mb-2">{service.name}</h3>
            <p>{service.description}</p>
            <p className="text-gray-500">{t('price')}: {service.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}