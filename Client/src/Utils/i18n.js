import i18n from 'i18next';
import detector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import translationEN from './Locales/en/translation.json';
import translationFR from './Locales/fr/translation.json';
import translationKINY from './Locales/rw/translation.json';

const lang = localStorage.getItem('i18nextLng');
if (!lang) localStorage.setItem('i18nextLng', 'en');

// the translations
const resources = {
  en: {
    translation: translationEN,
  },
  fr: {
    translation: translationFR,
  },
  rw: {
    translation: translationKINY,
  },
};

i18n
  .use(detector)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lang: 'en',
    fallbackLng: 'en',

    keySeparator: false, // we do not use keys in form messages.welcome

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
