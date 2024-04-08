import React from "react"
import {useTranslation} from "react-i18next"
import {SUPPORTED_LANGUAGES} from "../../i18n"


const LanguagePicker: React.FC = () => {
    const {t, i18n} = useTranslation(["setting", "common"])

    return (
        <div>
            <h4 className="text-gray-700 text-lg">{t("language")}</h4>
            <div className="flex ">
                {SUPPORTED_LANGUAGES.map(lng => (
                    <img
                        key={lng}
                        className={`h-10 mx-2 rounded-lg cursor-pointer border-solid border-2 hover:border-indigo-400 ${i18n.language === lng ? "border-solid border-2 border-indigo-300" : ""}`}
                        src={`/img/flag/${lng}.jpg`}
                        onClick={() => i18n.changeLanguage(lng)}
                        alt={lng + " flag"}
                    />
                ))}
            </div>
        </div>
    )
}

export default LanguagePicker