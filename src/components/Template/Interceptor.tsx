import React from "react"
import {apiClient, AXIOS_TIMEOUT} from "../../data/http"
import {message} from "antd"
import {AxiosError, AxiosPromise, AxiosRequestConfig, AxiosResponse} from "axios"
import {RouteComponentProps, withRouter} from "react-router"
import {WithTranslation, withTranslation} from "react-i18next"
import {refresh} from "../../data/security"
import {AppContext} from "../../context/app/context"
import {AppActionType} from "../../context/app/action"
import {TokenSet} from "../../data/security/types"

type InterceptorProps = WithTranslation & RouteComponentProps
type InterceptState = {
    error?: string
}

class Interceptor extends React.Component<InterceptorProps, InterceptState> {
    refreshingPromise?: AxiosPromise<TokenSet>
    intercept?: number[]

    context!: React.ContextType<typeof AppContext>
    state: InterceptState = {}

    componentDidMount() {
        this.intercept = [
            apiClient.interceptors.request.use(
                this.axiosRequestInterceptor, e => Promise.reject(e)
            ),
            apiClient.interceptors.response.use(
                this.axiosResponseInterceptor,
                this.axiosResponseErrorInterceptor,
            )
        ]

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

    handleOffline = () => {
        message.error(this.props.t("offline"))
    }

    handleOnline = () => {
        message.info(this.props.t("online"))
    }

    axiosRequestInterceptor = async (request: AxiosRequestConfig): Promise<AxiosRequestConfig> => {
        if (!request.url?.startsWith("/auth") && this.context.state.token_expiration - (AXIOS_TIMEOUT + 10_000) <= new Date().getTime()) {
            return new Promise<AxiosRequestConfig>((execute, reject) => {
                delete apiClient.defaults.headers.common["Authorization"]

                this.refreshToken(reject).then(res => {
                    request.headers = request.headers ?? {}
                    request.headers["Authorization"] = `Bearer ${res.data.token}`
                    execute(request)
                })
            })
        }
        return request
    }

    refreshToken(reject: (e: Error) => void): AxiosPromise<TokenSet> {
        if (!this.refreshingPromise)
            (this.refreshingPromise = refresh()).then(res => {
                try {
                    this.context.dispatch({
                        type: AppActionType.SET_TOKEN,
                        token: res.data.token
                    })
                } catch (e) {
                    reject(new Error("JWT cookie unreadable"))
                }

                this.refreshingPromise = undefined
            }).catch(() => {
                this.refreshingPromise = undefined
                this.props.history.push("/login")
                this.context.dispatch({type: AppActionType.SET_LOGGED_OUT})

                message.error(this.props.t("user_disconnected"))
            })
        return this.refreshingPromise
    }

    axiosResponseInterceptor = (response: AxiosResponse) => response

    axiosResponseErrorInterceptor = (error: AxiosError) => {
        if (error.response) {
            const {t} = this.props
            console.debug(`[${error.code}] ${error.message}`)

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
                    if (!error.request?.url.startsWith("/auth")) {
                        this.props.history.push("/login")
                        this.context.dispatch({type: AppActionType.SET_LOGGED_OUT})

                        message.error(t("user_disconnected"))
                    }
                    break
                case 404:
                    message.error(t(error.message))
                    this.props.history.replace("/404")

                    break
                case 500:
                    message.error(t(`error_encountered.${Math.floor(Math.random() * 3)}`))
                    break
                default:
                    message.error(t(error.message))

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

Interceptor.contextType = AppContext

export default withRouter(withTranslation("error")(Interceptor))
