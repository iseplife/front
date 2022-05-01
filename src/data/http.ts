import axios, {AxiosInstance, AxiosPromise} from "axios"
import {JSONDateParser} from "../util"
import { apiURI } from "./http.constants"

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

export function getAPIStatus(): AxiosPromise {
    return apiClient.get("/health", {
        transformResponse: res => res,
        responseType: "text"
    })
}