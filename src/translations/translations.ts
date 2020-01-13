import login_en from "./en/login.json";
import date_en from "./en/date.json";
import event_en from "./en/event.json";
import common_en from "./en/common.json";

import login_fr from "./fr/login.json";
import date_fr from "./fr/date.json";
import event_fr from "./fr/event.json";
import common_fr from "./fr/common.json";

export const en = {
    login: login_en,
    date: date_en,
    common: common_en,
    event: event_en
};
export const fr = {
    login: login_fr,
    date: date_fr,
    common: common_fr,
    event: event_fr
};

const translations = {
    en,
    fr
};
export default translations;