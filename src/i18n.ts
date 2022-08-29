import i18n from "i18next"
import {initReactI18next} from "react-i18next"
import translations from "./translations/translations"
import {updateSettings} from "./data/student"
import {message} from "antd"

export const SUPPORTED_LANGUAGES = Object.keys(translations)

i18n
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
        resources: translations,
        ns: ["login", "common"],
        defaultNS: "common",
        lng: localStorage.getItem("lng") || "fr",
        returnObjects: true,
        // whitelist: ["en", "fr"],
        keySeparator: ".", // we do not use keys in form messages.welcome
        interpolation: {
            escapeValue: false // react already safes from xss
        }
    })

i18n.on("languageChanged", (lng) => {
    localStorage.setItem("lng", lng)
    if(localStorage.getItem("logged") == "1")
        updateSettings({
            language: lng
        }).catch(() => message.error(i18n.t("error") as string))
})

export default i18n