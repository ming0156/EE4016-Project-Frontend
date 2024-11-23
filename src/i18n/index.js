import { formLabelClasses } from '@mui/material';
import i18n from 'i18next';
import { initReactI18next } from "react-i18next";
import en from './en';
import sc from './sc';
import tc from './tc';

i18n
    // load translation using http -> see /public/locales
    // learn more: https://github.com/i18next/i18next-http-backend
    //   .use(Backend)
    // detect user language
    // learn more: https://github.com/i18next/i18next-browser-languageDetector
    //   .use(LanguageDetector)
    // pass the i18n instance to the react-i18next components.
    // Alternative use the I18nextProvider: https://react.i18next.com/components/i18nextprovider
    .use(initReactI18next)
    // init i18next
    // for all options read: https://www.i18next.com/overview/configuration-options
    .init({
        lng: "en",
        fallbackLng: 'en',
        debug: formLabelClasses,

        interpolation: {
            escapeValue: false, // not needed for react as it escapes by default
        },

        // special options for react-i18next
        // learn more: https://react.i18next.com/components/i18next-instance
        resources: {
            en: {
                translation: en,
            },
            tc: {
                translation: tc,
            },
            sc: {
                translation: sc,
            },
        },
        react: {
            wait: true,
        },
    });

export default i18n;