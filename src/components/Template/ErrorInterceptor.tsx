import React from "react"
import {apiClient, AXIOS_TIMEOUT, getAPIStatus} from "../../data/http"
import {message} from "antd"
import {AxiosError, AxiosPromise, AxiosRequestConfig, AxiosResponse} from "axios"
import {RouteComponentProps, withRouter} from "react-router-dom"
import {WithTranslation, withTranslation} from "react-i18next"
import {refresh} from "../../data/security"
import {AppContext} from "../../context/app/context"
import {AppActionType} from "../../context/app/action"
import {TokenSet} from "../../data/security/types"
import {LocationState} from "../../data/request.type"

type InterceptorProps = WithTranslation & RouteComponentProps
type InterceptState = {
    error?: string
}

export let refreshToken: () => AxiosPromise<TokenSet>
export let getToken: (url?: string) => Promise<string>

class ErrorInterceptor extends React.Component<InterceptorProps, InterceptState> {
    refreshingPromise?: AxiosPromise<TokenSet>
    intercept?: number[]

    declare context: React.ContextType<typeof AppContext>
    state: InterceptState = {}

    componentDidMount() {
        refreshToken = this.refreshToken.bind(this)

        getToken = async (url?: string) => {
            if(this.context.state.token_expiration - (AXIOS_TIMEOUT + 10_000) <= new Date().getTime()) {
                if(url)
                    console.debug(`[ErrorInterceptor] Refreshing on request : "${url}"`)
                else
                    console.debug("[ErrorInterceptor] Refreshing token without request")
                
                await this.refreshToken()
            }
            return this.context.state.jwt
        }
        this.intercept = [
            apiClient.interceptors.request.use(
                this.axiosRequestInterceptor, e => Promise.reject(e)
            ),
            apiClient.interceptors.response.use(
                this.axiosResponseInterceptor,
                this.axiosResponseErrorInterceptor,
            )
        ]

        this.checkAPIConnection()

        window.addEventListener("offline", this.handleOffline)
        window.addEventListener("online", this.handleOnline)
    }

    componentWillUnmount() {
        if (this.intercept) {
            apiClient.interceptors.request.eject(this.intercept[0])
            apiClient.interceptors.response.eject(this.intercept[1])
        }

        window.removeEventListener("offline", this.handleOffline)
        window.removeEventListener("online", this.handleOnline)
    }

    checkAPIConnection = () => {
        getAPIStatus().catch(() => {
            this.props.history.push( "/maintenance")
        }).then(() => {
            if(location.pathname == "/maintenance"){
                const from = (window.history.state?.state as LocationState)?.from || {
                    pathname: !this.context.state.payload || this.context.state.payload.lastConnection ? "/" : "/discovery"
                }
                this.props.history.push(from.pathname)
            }
        })
    }

    handleOffline = () => {
        // message.error(this.props.t("offline"))
    }

    handleOnline = () => {
        // message.info(this.props.t("online"))
    }

    REGEX_UNSECURE_API_PREFIX = /^\/(auth|health)/
    axiosRequestInterceptor = async (request: AxiosRequestConfig): Promise<AxiosRequestConfig> => {
        if (!request.url?.match(this.REGEX_UNSECURE_API_PREFIX) && this.context.state.token_expiration - (AXIOS_TIMEOUT + 10_000) <= new Date().getTime()) {
            return new Promise<AxiosRequestConfig>((execute, reject) => {
                delete apiClient.defaults.headers.common["Authorization"]

                this.refreshToken().then(res => {
                    request.headers = request.headers ?? {}
                    request.headers["Authorization"] = `Bearer ${res.data.token}`
                    execute(request)
                }).catch((e: Error) => {
                    if(e.message !== "refreshing failed")
                        reject(e)
                })
            })
        }
        return request
    }

    refreshToken(): AxiosPromise<TokenSet> {
        if (!this.refreshingPromise) {
            this.refreshingPromise = (async () => {
                try {
                    const res = await refresh()
                    this.context.dispatch({
                        type: AppActionType.SET_TOKEN,
                        token: res.data.token
                    })
                    this.refreshingPromise = undefined

                    return res
                } catch (e) {
                    const err = e as AxiosError
                    if (err.response?.status === 401) {
                        this.refreshingPromise = undefined
                        this.props.history.push("/login")
                        if(localStorage.getItem("logged") == "1")
                            message.error(this.props.t("user_disconnected"))
                        this.context.dispatch({ type: AppActionType.SET_LOGGED_OUT })

                        console.debug("refreshing failed", e)
                        throw new Error("refreshing failed")
                    } else
                        throw e
                }
            })()
        }
        return this.refreshingPromise
    }

    axiosResponseInterceptor = (response: AxiosResponse) => response

    axiosResponseErrorInterceptor = (error: AxiosError) => {
        if (error.response) {
            const {t, i18n} = this.props
            console.debug(`[${error.code}] ${error.message}`)
            console.debug(error)

            const auth = error.request?.url?.startsWith("/auth") || error.request?.responseURL?.includes("/auth")

            /* We handle only special error which required specific behavior, otherwise display error message */
            switch (error.response.status) {
                case 503:
                    message.error(t("server_disconnected"))
                    break
                case 403:
                    message.error(t("user_disconnected"))
                    this.props.history.push("/login")
                    this.context.dispatch({type: AppActionType.SET_LOGGED_OUT})
                    break
                case 401:
                    // 401 Error code of /auth are handled in axiosRequestInterceptor function
                    if (auth)
                        return Promise.reject(error)

                    this.props.history.push("/login")
                    this.context.dispatch({ type: AppActionType.SET_LOGGED_OUT })

                    message.error(t("user_disconnected"))
                    break
                case 500:
                    message.error(t(`error_encountered.${Math.floor(Math.random() * 3)}`))
                    return Promise.reject(error)
                default:
                    if(!auth) {
                        const errorKey = `error:${(error.response.data as { message: string }).message}`
                        message.error(t(i18n.exists(errorKey) ?
                            errorKey :
                            `error_encountered.${Math.floor(Math.random() * 3)}`)
                        )
                    }
                    return Promise.reject(error)
            }
        } else {
            return Promise.reject(error)
        }
    }

    render() {
        return null
    }
}

ErrorInterceptor.contextType = AppContext

export default withRouter(withTranslation("error")(ErrorInterceptor))
