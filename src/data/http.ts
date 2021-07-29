import axios, {AxiosInstance} from "axios"
import {JSONDateParser} from "../util"

const url = process.env.REACT_APP_API_URL || "localhost:8080"

export const apiURI = `${process.env.REACT_APP_HTTP_PROTOCOL || "http"}://${url}`
export const swURI = `${process.env.PUBLIC_URL || "ws"}://${url}`

export let apiClient: AxiosInstance

export function initializeAPIClient(): AxiosInstance {
    return apiClient = axios.create({
        baseURL: apiURI,
        headers: {
            common: {
                "Access-Control-Max-Age": "3600"
            }
        },
        transformResponse: (response, req) => req["content-type"] === "application/json" ? JSON.parse(response, JSONDateParser) : response
    })
}
