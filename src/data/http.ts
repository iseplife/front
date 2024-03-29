import axios, {AxiosInstance, AxiosPromise} from "axios"
import {JSONDateParser} from "../util"
import { apiURI } from "./http.constants"

export let apiClient: AxiosInstance
export const AXIOS_TIMEOUT = 60_000 * 5
export const appUrl = new URL(process.env.REACT_APP_URL ?? window.location.origin)

export function initializeAPIClient(): AxiosInstance {
    return apiClient = axios.create({
        baseURL: apiURI,
        timeout: AXIOS_TIMEOUT,
        withCredentials: true,
        
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

export async function tryMultipleTimes<T, V>(tries: number, fnc: (...any: T[]) => Promise<V>, ...args: T[]): Promise<V> {
    for(let i = tries;i--;){
        try{
            return await fnc(...args)
        }catch(e){
            if(!i)
                throw e
        }
    }
    throw new Error("unreachable")
}