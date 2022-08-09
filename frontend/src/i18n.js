import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import resources from './locales/translation.js'

const { translation } = resources;

i18n
  .use(initReactI18next)
  .init({
    debug: true,
    lng: 'ru',
    resources: {
      ru: {
        translation,
      }
    },
  });

export default i18n;