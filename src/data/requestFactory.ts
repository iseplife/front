import axios from "axios"
import {getCookie} from "./security/cookie"
import {JSONDateParser} from "../util"

const url = process.env.REACT_APP_API_URL || "localhost:8080"
export const apiURI = `${process.env.REACT_APP_HTTP_PROTOCOL || "http"}://${url}`
export const swURI = `${process.env.PUBLIC_URL || "ws"}://${url}`

export function initializeAxios(): void {
    const token = getCookie("token")
    const refreshToken = getCookie("refreshToken")

    axios.defaults.baseURL = apiURI
    axios.defaults.transformResponse = (response, req) => req["content-type"] === "application/json" ? JSON.parse(response, JSONDateParser): response
    if (token && refreshToken) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
        axios.defaults.headers.common["X-Refresh-Token"] = refreshToken
        axios.defaults.headers.common["Access-Control-Max-Age"] = "3600"
    }
}