import React from "react"
import {apiClient} from "../../data/http"
import {message} from "antd"
import {AxiosError, AxiosRequestConfig, AxiosResponse} from "axios"
import {RouteComponentProps, withRouter} from "react-router"
import {WithTranslation, withTranslation} from "react-i18next"
import {refresh, removeTokens, setTokens} from "../../data/security"
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

    axiosRequestInterceptor = (request: AxiosRequestConfig) => {
        /**
        if(this.context.state.refreshing && request.url !== "/auth/refresh"){
            while (this.context.state.refreshing){
                console.log("holding")
            }
            request.headers["X-Refresh-Token"] = getCookie("refresh-token")
            request.headers["Authorization"] = getCookie("token")
        }
         **/
        return request
    }

    axiosResponseInterceptor = (response: AxiosResponse) => response

    axiosResponseErrorInterceptor = (error: AxiosError) => {
        const originalRequest = error.config
        if (error.response) {
            switch (error.response.status) {
                case 404:
                    //this.props.history.push("/404")
                    break
                case 403:
                    // @ts-ignore
                    if (originalRequest.headers["X-Refresh-Token"] && !originalRequest._retry) {
                        this.context.dispatch({type: AppActionType.SET_REFRESHING, refreshing: true})
                        // @ts-ignore
                        originalRequest._retry = true
                        delete apiClient.defaults.headers.common["Authorization"]
                        delete apiClient.defaults.headers.common["X-Refresh-Token"]
                        return refresh(getCookie("refresh-token") || originalRequest.headers["X-Refresh-Token"])
                            .then(res => {
                                setTokens(res.data)

                                originalRequest.headers["X-Refresh-Token"] = res.data.refreshToken
                                originalRequest.headers["Authorization"] = `Bearer ${res.data.token}`
                                return apiClient(originalRequest)
                            }).finally(() => this.context.dispatch({type: AppActionType.SET_REFRESHING, refreshing: false}))
                    } else {
                        removeTokens()
                        this.props.history.push("/login")

                        message.error("Vous avez été déconnecté !")
                    }
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