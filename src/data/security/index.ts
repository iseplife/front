import {Role, Roles, Token, TokenPayload, TokenSet} from "./types"
import  {AxiosPromise} from "axios"
import {getCookie, removeCookie, setCookie} from "./cookie"
import {apiClient} from "../http"

export const connect = (username: string, password: string): Promise<TokenPayload> => {
    logout()
    return apiClient
        .post("/auth", {
            username,
            password,
        }).then(res => {
            setTokens(res.data)
            return getUser()
        })
}

export const refresh = (refreshToken: string): AxiosPromise<TokenSet> => apiClient.post("/auth/refresh", {refreshToken})

export const getRoles = (): AxiosPromise<Role[]> => apiClient.get("auth/roles")

export const setTokens = (tokenSet: TokenSet): void => {
    setCookie("token", tokenSet.token , {
        "samesite": "Strict",
        "max-age": 600      //10 min
    })
    setCookie("refresh-token", tokenSet.refreshToken, {
        "samesite": "Strict",
        "max-age": 604800  //7 days
    })
    apiClient.defaults.headers.common["Authorization"] = `Bearer ${tokenSet.token}`
    apiClient.defaults.headers.common["X-Refresh-Token"] = tokenSet.refreshToken
}
export const removeTokens = (): void => {
    removeCookie("token")
    removeCookie("refresh-token")
    delete apiClient.defaults.headers.common["Authorization"]
    delete apiClient.defaults.headers.common["X-Refresh-Token"]
}

export const getToken = (): Token  => {
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

export const getUser = (): TokenPayload => JSON.parse(getToken().payload) as TokenPayload

export const isAdmin = (): boolean => hasRole([Roles.ADMIN])

export const hasRole = (roles: Array<Roles>): boolean =>  {
    const user = getUser()
    return Boolean(user && roles.filter(r => user.roles.includes(r)).length > 0)
}

export const isLoggedIn = (): boolean => {
    return !!getCookie("refresh-token")
}

export const logout = (): void => removeTokens()
