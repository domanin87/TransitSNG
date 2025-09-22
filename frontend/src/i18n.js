import i18n from 'i18next'; import { initReactI18next } from 'react-i18next'; import LanguageDetector from 'i18next-browser-languagedetector';
import ru from './locales/ru.json'; import kk from './locales/kk.json'; import en from './locales/en.json';

i18n.use(initReactI18next).use(LanguageDetector).init({
  resources: { ru: { translation: ru }, kk: { translation: kk }, en: { translation: en } },
  fallbackLng: 'ru',
  interpolation: { escapeValue: false }
});
export default i18n;
