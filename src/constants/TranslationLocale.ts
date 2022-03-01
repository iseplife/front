import { enUS, fr } from "date-fns/locale"

export function getLocaleFromTranslation(translation: string) {
    return {
        fr: fr,
        en: enUS
    }[translation]
}