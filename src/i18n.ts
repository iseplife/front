import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import translations from "./translations/translations";

i18n
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
        resources: translations,
        ns: ['login', 'common'],
        defaultNS: 'global',
        lng: "fr",
        whitelist: ["en", "fr"],
        keySeparator: '.', // we do not use keys in form messages.welcome
        interpolation: {
            escapeValue: false // react already safes from xss
        }
    }).then(r => {});
export default i18n;