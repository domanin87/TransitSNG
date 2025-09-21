import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function ServiceCard({ s, logged }) {
  const { t } = useTranslation();
  return (
    <article className={'card ' + (s.dark ? 'card-dark' : '')}>
      <h3>{s.title}</h3>
      <div className="meta">{s.route}</div>
      <div className="price">{s.price} {s.currency}</div>
      <div className="meta">{s.weight ? s.weight + ' ' + t('tons') : ''}</div>
      <div style={{ marginTop: 12 }}>
        {logged ? (
          <div style={{ color: 'var(--text)' }}>{t('contacts')}: {s.contact}</div>
        ) : (
          <div style={{ color: 'var(--muted)' }}>
            <p>{t('contacts_hidden')}</p>
            <div style={{ marginTop: '10px' }}>
              <Link to="/login" className="btn" style={{ marginRight: '10px', padding: '8px 12px' }}>
                {t('login')}
              </Link>
              <Link to="/register" className="btn" style={{ padding: '8px 12px' }}>
                {t('register')}
              </Link>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}