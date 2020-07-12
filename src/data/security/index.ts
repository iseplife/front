import {Role, Roles, Token, TokenPayload, TokenSet} from "./types"
import axios, {AxiosPromise} from "axios"
import {getCookie, removeCookie, setCookie} from "./cookie"
export const connect = (username: string, password: string): Promise<void> => {
    
    logout()
    return axios
        .post("/auth", {
            username,
            password,
        }).then(res => {
            setTokens(res.data)
        })
}

export const getRoles = (): AxiosPromise<Role[]> => {
    return axios.get("auth/roles")
}


export const setTokens = (tokenSet: TokenSet): void => {
    setCookie("token", tokenSet.token , {
        "max-age": 600      //10 min
    })
    setCookie("refreshToken", tokenSet.refreshToken, {
        "max-age": 604800  //7 days
    })
    axios.defaults.headers.common["Authorization"] = `Bearer ${tokenSet.token}`
    axios.defaults.headers.common["X-Refresh-Token"] = tokenSet.refreshToken
}
export const removeTokens = (): void => {
    removeCookie("token")
    removeCookie("refreshToken")
    delete axios.defaults.headers.common["Authorization"]
    delete axios.defaults.headers.common["X-Refresh-Token"]
}


export const getUser = (): TokenPayload => {
    const token = getCookie("token")
    let rawdata = ""
    if (token) {
        rawdata = token.split(".")[1]
        try {
            const tokenJson = JSON.parse(atob(rawdata)) as Token
            return JSON.parse(tokenJson.payload) as TokenPayload
        } catch (e) {
            throw new Error("Auth cookies unreadable")
        }
    }
    throw new Error("Auth cookies missing")
}


export const isAdmin = (): boolean => hasRole([Roles.ADMIN])

export const hasRole = (roles: Array<Roles>): boolean =>  {
    const user = getUser()
    return Boolean(user && roles.filter(r => user.roles.includes(r)).length > 0)
}

export const isLoggedIn = (): boolean => !!getCookie("token")

export const logout = (): void => removeTokens()
