import {ParsedToken, Role, Token, TokenSet} from "./types"
import {AxiosPromise} from "axios"
import {getCookie} from "./cookie"
import {apiClient} from "../http"

export const connect = (username: string, password: string): AxiosPromise<TokenSet> => {
    logout()
    return apiClient.post("/auth", {username, password})
}

export const refresh = (): AxiosPromise<TokenSet> => apiClient.post("/auth/refresh")

export const getRoles = (): AxiosPromise<Role[]> => apiClient.get("auth/roles")

export const setToken = (tokenSet: TokenSet): void => {
    apiClient.defaults.headers.common["Authorization"] = `Bearer ${tokenSet.token}`
}

export const parseToken = (token: string): ParsedToken => {
    try {
        const rawdata = JSON.parse(atob(token.split(".")[1])) as Token
        return {
            ...rawdata,
            payload: JSON.parse(rawdata.payload)
        }
    } catch (e) {
        throw new Error("Auth cookies unreadable")
    }
}

export const getToken = (): Token => {
    const token = getCookie("token")
    let rawdata = ""
    if (token) {
        rawdata = token.split(".")[1]
        try {
            return JSON.parse(atob(rawdata)) as Token
        } catch (e) {
            throw new Error("Auth cookies unreadable")
        }
    }
    window.location.assign("/login")
    throw new Error("Auth cookies missing")
}

export const isLoggedIn = (): boolean => {
    return false
}

export const logout = (): void => {
    delete apiClient.defaults.headers.common["Authorization"]
}
