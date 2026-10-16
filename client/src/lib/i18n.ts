import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslation from './locales/en.json';
import nlTranslation from './locales/nl.json';
import arTranslation from './locales/ar.json';
import esTranslation from './locales/es.json';
import ptTranslation from './locales/pt.json';
import trTranslation from './locales/tr.json';
import deTranslation from './locales/de.json';
import ruTranslation from './locales/ru.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      nl: {
        translation: nlTranslation
      },
      en: {
        translation: enTranslation
      },
      es: {
        translation: esTranslation
      },
      pt: {
        translation: ptTranslation
      },
      tr: {
        translation: trTranslation
      },
      de: {
        translation: deTranslation
      },
      ru: {
        translation: ruTranslation
      },
      ar: {
        translation: arTranslation
      }
    },
    lng: 'nl',
    fallbackLng: 'nl',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
