import axios, {AxiosInstance} from "axios"
import {JSONDateParser} from "../util"

const url = process.env.REACT_APP_API_URL || "localhost:8080"

export const apiURI = `${process.env.REACT_APP_HTTP_PROTOCOL || "http"}://${url}`
export const wsURI = `${process.env.PUBLIC_URL || "ws"}://${url}/ws`

export let apiClient: AxiosInstance
export const AXIOS_TIMEOUT = 35_000

export function initializeAPIClient(): AxiosInstance {
    return apiClient = axios.create({
        baseURL: apiURI,
        timeout: AXIOS_TIMEOUT,
        headers: {
            "Access-Control-Max-Age": "3600"
        },
        transformResponse: (response, req = {}) => req["content-type"] === "application/json" ? JSON.parse(response, JSONDateParser) : response
    })
}