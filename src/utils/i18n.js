import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translationEN from '../languageTranslations/en.json';
import translationKO from '../languageTranslations/ko.json';


const resources = {
  en: {
    translation: translationEN,
  },
  ko: {
    translation: translationKO,
  },
};


i18n.use(initReactI18next).init({
  resources,
  lng: 'en', // Default language
  fallbackLng: 'en',
  keySeparator: false, // Disable key separator to use nested keys
  interpolation: {
    escapeValue: false, // React already escapes values
  },
});

export default i18n;
