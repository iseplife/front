import { AxiosPromise } from "axios"
import { feedsManager } from "../../datamanager/FeedsManager"
import { apiClient } from "../http"
import { SubscribableType } from "./SubscribableType"

export const subscribe = (id: number, type: SubscribableType, extensive = false): AxiosPromise<void> => 
    apiClient.put(`/subscription/${type}/${id}`, { extensive })

export const unsubscribe = (id: number): AxiosPromise<void> => apiClient.delete(`/subscription/${id}`)

export const isSubscribed = (id: number): AxiosPromise<void> => apiClient.get(`/subscription/${id}`)