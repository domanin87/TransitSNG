import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ru from './locales/ru.json';
import kk from './locales/kk.json';
import en from './locales/en.json';
import tg from './locales/tg.json';
import uz from './locales/uz.json';
import tm from './locales/tm.json';
import be from './locales/be.json';
import az from './locales/az.json';
import hy from './locales/hy.json';
import md from './locales/md.json';

i18n.use(initReactI18next).init({
  resources: {
    ru: { translation: ru },
    kk: { translation: kk },
    en: { translation: en },
    tg: { translation: tg },
    uz: { translation: uz },
    tm: { translation: tm },
    be: { translation: be },
    az: { translation: az },
    hy: { translation: hy },
    md: { translation: md },
  },
  lng: localStorage.getItem('lng') || 'ru',
  fallbackLng: 'ru',
  interpolation: { escapeValue: false },
});

export default i18n;