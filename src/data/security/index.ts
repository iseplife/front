import {ParsedToken, Role, Token, TokenSet} from "./types"
import {AxiosPromise} from "axios"
import {apiClient} from "../http"

export const connect = (username: string, password: string): AxiosPromise<TokenSet> => {
    logout()
    return apiClient.post("/auth", {username, password})
}

export const refresh = (): AxiosPromise<TokenSet> => apiClient.post("/auth/refresh")

export const getRoles = (): AxiosPromise<Role[]> => apiClient.get("auth/roles")

let token: Token
let jwt: string

export const setToken = (tokenSet: TokenSet): void => {
    localStorage.refreshToken = tokenSet.refreshToken
    token = JSON.parse(atob(tokenSet.token.split(".")[1]))
    jwt = tokenSet.token
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
    return token
}
    
export const getJWT = (): string => {
    return jwt
}

export const isLoggedIn = (): boolean => {
    return false
}

export const logout = (): void => {
    delete apiClient.defaults.headers.common["Authorization"]
}
