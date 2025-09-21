import React from 'react';
import { useTranslation } from 'react-i18next';

const LANGS = [
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
  { code: 'kk', label: 'Қазақша', flag: '🇰🇿' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'tg', label: 'Тоҷикӣ', flag: '🇹🇯' },
  { code: 'uz', label: 'Oʻzbek', flag: '🇺🇿' },
  { code: 'tm', label: 'Türkmençe', flag: '🇹🇲' },
  { code: 'be', label: 'Беларуская', flag: '🇧🇾' },
  { code: 'az', label: 'Azərbaycanca', flag: '🇦🇿' },
  { code: 'hy', label: 'Հայերեն', flag: '🇦🇲' },
  { code: 'md', label: 'Română', flag: '🇲🇩' },
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const change = (code) => {
    i18n.changeLanguage(code);
    localStorage.setItem('lng', code);
  };

  return (
    <select
      value={i18n.language}
      onChange={(e) => change(e.target.value)}
      className="input small"
    >
      {LANGS.map((l) => (
        <option key={l.code} value={l.code}>
          {l.flag} {l.label}
        </option>
      ))}
    </select>
  );
}