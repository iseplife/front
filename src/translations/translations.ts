import login_en from "./en/login.json"
import date_en from "./en/date.json"
import event_en from "./en/event.json"
import common_en from "./en/common.json"
import gallery_en from "./en/gallery.json"
import user_en from "./en/user.json"
import search_en from "./en/search.json"
import discovery_en from "./en/discovery.json"
import club_en from "./en/club.json"
import group_en from "./en/group.json"

import login_fr from "./fr/login.json"
import date_fr from "./fr/date.json"
import event_fr from "./fr/event.json"
import common_fr from "./fr/common.json"
import gallery_fr from "./fr/gallery.json"
import user_fr from "./fr/user.json"
import search_fr from "./fr/search.json"
import discovery_fr from "./fr/discovery.json"
import club_fr from "./fr/club.json"
import group_fr from "./fr/group.json"

export const en = {
    login: login_en,
    date: date_en,
    common: common_en,
    event: event_en,
    discovery: discovery_en,
    user: user_en,
    gallery: gallery_en,
    club: club_en,
    group: group_en,
    search: search_en
}
export const fr = {
    login: login_fr,
    date: date_fr,
    common: common_fr,
    event: event_fr,
    discovery: discovery_fr,
    user: user_fr,
    gallery: gallery_fr,
    club: club_fr,
    group: group_fr,
    search: search_fr
}

const translations = {en, fr}
export default translations