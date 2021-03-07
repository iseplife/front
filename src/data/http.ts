import axios, {AxiosInstance} from "axios"
import {getCookie} from "./security/cookie"
import {JSONDateParser} from "../util"

const url = process.env.REACT_APP_API_URL || "localhost:8080"

export const apiURI = `${process.env.REACT_APP_HTTP_PROTOCOL || "http"}://${url}`
export const swURI = `${process.env.PUBLIC_URL || "ws"}://${url}`

export let apiClient: AxiosInstance
export function initializeAPIClient(): AxiosInstance {
    const token = getCookie("token")
    const refreshToken = getCookie("refresh-token")

    return apiClient = axios.create({
        baseURL: apiURI,
        headers: {
            common: {
                "Authorization": `Bearer ${token}`,
                "X-Refresh-Token": refreshToken,
                "Access-Control-Max-Age": "3600"
            }
        },
        transformResponse: (response, req) => req["content-type"] === "application/json" ? JSON.parse(response, JSONDateParser): response
    })
}