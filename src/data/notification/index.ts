import { AxiosPromise } from "axios"
import { AppActionType, AppContextAction } from "../../context/app/action"
import { apiClient } from "../http"
import { Page } from "../request.type"
import { LoggedStudentPreview } from "../student/types"
import { Notification } from "./types"

export const loadNotifications = (page: number) : AxiosPromise<Page<Notification>> => apiClient.get(`/notifications/${page}`)
export const setNotificationsWatched = async (notifications: Notification[], loggedUser: LoggedStudentPreview, dispatch: (value: AppContextAction) => void) => {
    const unwatched: number = (await apiClient.post("/notifications/watch", notifications.reduce((form, val) => {form.append("ids[]", val.id.toString()); return form}, new FormData())))?.data
    if(unwatched)
        dispatch({
            type: AppActionType.SET_UNWATCHED_NOTIFICATIONS,
            payload: unwatched
        })
}