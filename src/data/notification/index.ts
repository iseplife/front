import { AxiosPromise } from "axios"
import { apiClient } from "../http"
import { Page } from "../request.type"
import { Notification } from "./types"

export const loadNotifications = (page: number) : AxiosPromise<Page<Notification>> => apiClient.get(`/notifications/${page}`)
export const setNotificationsWatched = (...notifications: Notification[]) => notifications.length && apiClient.post("/notifications/watch", notifications.reduce((form, val) => {form.append("ids[]", val.id.toString()); return form}, new FormData()))