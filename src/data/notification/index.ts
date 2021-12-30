import { AxiosPromise } from "axios"
import { apiClient } from "../http"
import { Page } from "../request.type"
import { Notification } from "./types"

export const loadNotifications = (page: number) : AxiosPromise<Page<Notification>> => apiClient.get(`/notifications/${page}`)
export const setNotificationsWatched = (notifications: Notification[]): AxiosPromise<number> => apiClient.post("/notifications/watch", {id: notifications})
