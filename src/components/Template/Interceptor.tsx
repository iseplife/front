import React from "react"
import {withRouter, RouteComponentProps} from "react-router"
import axios, {AxiosError, AxiosResponse} from "axios"
import {removeTokens, setTokens} from "../../data/security"
import {message} from "antd"
import {WithTranslation, withTranslation, WithTranslationProps} from "react-i18next"

const errorMessages = [
    "Whoops nos serveurs ne répondent plus, nos techniciens s'en occupent 👊 !",
    "Désolé, nous ne sommes pas disponible pour le moment ! 🙀",
    "Revenez d'ici 5 min, il est possible que nous soyons en train de faire de la maintenance ! 🔧",
]

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
        this.intercept = axios.interceptors.response.use(
            this.axiosResponseInterceptor,
            this.axiosErrorInterceptor,
        )

        window.addEventListener("offline", this.handleOffline)
        window.addEventListener("online", this.handleOnline)
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.log("Aie... probleme", error, errorInfo)
    }

    componentWillUnmount() {
        if (this.intercept)
            axios.interceptors.response.eject(this.intercept)
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
        // Do something with response data
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
        if (error.response) {
            switch (error.response.status) {
                case 404:
                    props.history.push("/404")
                    break
                case 403:
                    removeTokens()
                    props.history.push("/login")
                    message.error("Vous avez été déconnecté !")
                    break
                case 500:
                case 400:
                    message.error("Un probleme a été rencontré")
                    console.error( `[${error.code}] ${error.message}`)
                    break
                case 503:
                    message.error("Serveur indisponible")
                    break
                default:
                    throw error
                    break
            }
        }
        return <p>Dommage</p>
    }

    selectRandom(messages: string[]) {
        const rnd = Math.round(Math.random() * (messages.length - 1))
        return messages[rnd]
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