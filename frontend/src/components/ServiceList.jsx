import React from 'react';
import ServiceCard from './ServiceCard';
import { useTranslation } from 'react-i18next';

export default function ServiceList({ items, logged }) {
  const { t } = useTranslation();
  return (
    <section className="grid">
      {items.length > 0 ? (
        items.map((i) => <ServiceCard key={i.id} s={i} logged={logged} />)
      ) : (
        <p>{t('no_services')}</p>
      )}
    </section>
  );
}