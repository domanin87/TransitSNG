import React from 'react';
import { useTranslation } from 'react-i18next';

export default function MapPage() {
  const { t } = useTranslation();
  return (
    <div className="container">
      <h2 className="text-2xl mb-4">{t('map')}</h2>
      <div className="card">
        <p>{t('map_placeholder')}</p>
        {/* Здесь будет интегрирована карта (например, Leaflet или Google Maps) */}
      </div>
    </div>
  );
}