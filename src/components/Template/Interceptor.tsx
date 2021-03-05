import React from "react"
import {withRouter, RouteComponentProps} from "react-router"
import axios, {AxiosError, AxiosResponse} from "axios"
import {refresh, removeTokens, setTokens} from "../../data/security"
import {message} from "antd"
import {WithTranslation, withTranslation} from "react-i18next"
import {apiClient} from "../../index"

type InterceptorProps = WithTranslation & RouteComponentProps
type InterceptState = {
    error: string;
};

class Interceptor extends React.Component<InterceptorProps, InterceptState> {
    state: InterceptState = {
        error: "",
    };
    intercept?: number;

    componentDidMount() {
        this.intercept = apiClient.interceptors.response.use(
            this.axiosResponseInterceptor,
            this.axiosErrorInterceptor,
        )

        window.addEventListener("offline", this.handleOffline)
        window.addEventListener("online", this.handleOnline)
    }

    componentWillUnmount() {
        if (this.intercept)
            apiClient.interceptors.response.eject(this.intercept)

        window.removeEventListener("offline", this.handleOffline)
        window.removeEventListener("online", this.handleOnline)
    }

    handleOffline = () => {
        message.error(this.props.t("offline"))
    };

    handleOnline = () => {
        message.info(this.props.t("online"))
    };

    axiosResponseInterceptor = (response: AxiosResponse) => {
        if (response.headers) {
            const token = response.headers["authorization"]
            const refreshToken = response.headers["x-refresh-token"]
            if (token && refreshToken) {
                setTokens({token, refreshToken})
            }
        }

        return response
    }

    axiosErrorInterceptor = (props: RouteComponentProps) => (error: AxiosError) => {
        if(axios.isCancel(error)){
            console.log("Request canceled", error.message)
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            return new Promise(() => {})
        }

        const originalRequest = error.config
        if (error.response) {
            switch (error.response.status) {
                case 404:
                    props.history.push("/404")
                    break
                case 403:
                    // @ts-ignore
                    if(originalRequest.headers["x-refresh-token"] && !error.config._retry) {

                        // @ts-ignore
                        error.config._retry = true
                        return refresh({
                            token: originalRequest.headers["authorization"],
                            refreshToken: originalRequest.headers["x-refresh-token"]
                        }).then(res => {
                            setTokens(res.data)

                            return axios(originalRequest)
                        })

                    }else {
                        removeTokens()
                        props.history.push("/login")
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
        return <p>Dommage</p>
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

export default withRouter(withTranslation()(Interceptor))