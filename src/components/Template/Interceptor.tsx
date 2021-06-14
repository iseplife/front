import React from "react"
import {apiClient} from "../../data/http"
import {message} from "antd"
import {AxiosError, AxiosRequestConfig, AxiosResponse} from "axios"
import {RouteComponentProps, withRouter} from "react-router"
import {WithTranslation, withTranslation} from "react-i18next"
import {getToken, refresh, removeTokens, setTokens} from "../../data/security"
import {getCookie} from "../../data/security/cookie"
import {AppContext} from "../../context/app/context"
import {AppActionType} from "../../context/app/action"

type InterceptorProps = WithTranslation & RouteComponentProps
type InterceptState = {
    error: string;
};

class Interceptor extends React.Component<InterceptorProps, InterceptState> {
    context!: React.ContextType<typeof AppContext>;
    intercept?: number[];

    state: InterceptState = {
        error: "",
    };

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
    };

    handleOnline = () => {
        message.info(this.props.t("online"))
    };

    axiosRequestInterceptor = async (request: AxiosRequestConfig) => {
        if (this.context.state.token_expiration <= new Date().getTime() && request.url !== "/auth/refresh") {
            delete apiClient.defaults.headers.common["Authorization"]
            delete apiClient.defaults.headers.common["X-Refresh-Token"]

            const refreshToken = getCookie("refresh-token") || request.headers["X-Refresh-Token"]
            await refresh(refreshToken).then(res => {
                setTokens(res.data)
                try {
                    this.context.dispatch({
                        type: AppActionType.SET_TOKEN_EXPIRATION,
                        token_expiration: getToken().exp
                    })
                } catch (e) {
                    throw new Error("JWT cookie unreadable")
                }

                request.headers["X-Refresh-Token"] = res.data.refreshToken
                request.headers["Authorization"] = `Bearer ${res.data.token}`
            })
        }

        return request
    }

    axiosResponseInterceptor = (response: AxiosResponse) => response

    axiosResponseErrorInterceptor = (error: AxiosError) => {
        if (error.response) {
            switch (error.response.status) {
                case 403:
                case 404:
                    this.props.history.push("/404")
                    break
                case 401:
                    removeTokens()
                    this.props.history.push("/login")

                    message.error("Vous avez été déconnecté !")
                    break
                case 500:
                case 400:
                    message.error("Un probleme a été rencontré")
                    console.error(`[${error.code}] ${error.message}`)
                    break
                case 503:
                    message.error("Serveur indisponible")
                    break
                default:
                    return Promise.reject(error)
            }
        }

        return Promise.reject(error)
    }

    render() {
        if (this.state.error) {
            return (
                <div>
                    aie aie aie
                </div>
            )
        }
        return null
    }
}

Interceptor.contextType = AppContext

export default withRouter(withTranslation()(Interceptor))
