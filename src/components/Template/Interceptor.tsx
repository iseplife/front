import React, {useContext, useEffect, useState} from "react"
import {RouteComponentProps, withRouter} from "react-router"
import {AxiosError, AxiosRequestConfig, AxiosResponse} from "axios"
import {refresh, removeTokens, setTokens} from "../../data/security"
import {message} from "antd"
import {WithTranslation, withTranslation} from "react-i18next"

import {getCookie} from "../../data/security/cookie"
import {apiClient} from "../../data/http"
import {AppContext} from "../../context/app/context"
import {AppActionType} from "../../context/app/action"

const REFRESH_URL = "/auth/refresh"

type InterceptorProps = WithTranslation & RouteComponentProps
const Interceptor: React.FC<InterceptorProps> = ({t, history}) => {
    const {state: {refreshing}, dispatch} = useContext(AppContext)
    const [error, setError] = useState<string>()

    const handleOffline = () => message.error(t("offline"))
    const handleOnline = () => message.info(t("online"))
    const isRefreshing = () => refreshing

    const axiosRequestInterceptor = (request: AxiosRequestConfig) => {
        if(isRefreshing() && request.url !== REFRESH_URL){
            while (isRefreshing()) {
                console.log("holding")
            }
            request.headers["X-Refresh-Token"] = getCookie("refresh-token")
            request.headers["Authorization"] = getCookie("refresh-token")
        }
        return request
    }

    const axiosResponseInterceptor = (response: AxiosResponse) => response

    const axiosResponseErrorInterceptor = (error: AxiosError) => {
        console.log(error)
        const originalRequest = error.config
        if (error.response) {
            switch (error.response.status) {
                case 404:
                    //this.props.history.push("/404")
                    break
                case 403:
                    // @ts-ignore
                    if (originalRequest.headers["X-Refresh-Token"] && !originalRequest._retry) {
                        dispatch({type: AppActionType.SET_REFRESHING, refreshing: true})
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
                            }).finally(() => dispatch({type: AppActionType.SET_REFRESHING, refreshing: false}))
                    } else {
                        console.log("cleaning tokens")
                        removeTokens()
                        history.push("/login")

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


    useEffect(() => {
        const intercept = [
            apiClient.interceptors.request.use(
                axiosRequestInterceptor,
                (e) => Promise.reject(e)
            ),
            apiClient.interceptors.response.use(
                axiosResponseInterceptor,
                axiosResponseErrorInterceptor,
            )
        ]

        window.addEventListener("offline", handleOffline)
        window.addEventListener("online", handleOnline)

        return () => {
            if (intercept){
                apiClient.interceptors.request.eject(intercept[0])
                apiClient.interceptors.response.eject(intercept[1])
            }

            window.removeEventListener("offline", handleOffline)
            window.removeEventListener("online", handleOnline)
        }
    })


    if (error) {
        return (
            <div>
                aie aie aie
            </div>
        )
    }
    return null
}


export default withRouter(withTranslation()(Interceptor))