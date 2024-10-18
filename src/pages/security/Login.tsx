import { Browser } from "@capacitor/browser"
import { useIonAlert } from "@ionic/react"
import React, { useCallback, useContext, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import Loading from "../../components/Common/Loading"
import { AppActionType } from "../../context/app/action"
import { AppContext } from "../../context/app/context"
import { isWeb } from "../../data/app"
import { connectSSO } from "../../data/security"
import { SUPPORTED_LANGUAGES } from "../../i18n"

const service = window.location.origin+"/login"
const ssoUrl = "https://portail-ovh.isep.fr/cas/login?service="+service

const Login: React.FC = () => {
    const {t, i18n} = useTranslation(["login", "common"])
    const {dispatch} = useContext(AppContext)

    const [loading, setLoadingStatus] = useState<boolean>(false)
    const [presentAlert] = useIonAlert()
    const [error, setError] = useState<string>()

    const cguAlert = useCallback((callback: (() => void)) => {
        presentAlert({
            header: t("common:cgu"),
            message: t("common:cgu_text"),
            buttons: [
                {
                    text: t("common:cgu_deny"),
                    role: "cancel",
                },
                {
                    text: t("common:cgu_open"),
                    role: "",
                    handler: () => {
                        window.open("https://docs.iseplife.fr/cgu.html", "_blank")
                        return false
                    },
                },
                {
                    text: t("common:cgu_accept"),
                    role: "confirm",
                    handler: callback,
                },
            ],
        })
    }, [presentAlert, t])

    const validateSSOToken = useCallback(() => {
        Browser.removeAllListeners()
        const token = localStorage.getItem("sso-token")
        if(token) {
            localStorage.removeItem("sso-token")
            cguAlert(() => {
                setLoadingStatus(true)
                connectSSO(token, service).then((res) => {
                    dispatch({
                        type: AppActionType.SET_TOKEN,
                        token: res.data.token
                    })
                    if(!isWeb)
                        localStorage.setItem("refresh", res.data.refreshToken)
                    localStorage.setItem("logged", "1")
                }).catch(_ => {
                    setLoadingStatus(false)
                    setError("Serveur indisponible")
                }).finally(() => setLoadingStatus(false))
            })
        } else {
            setLoadingStatus(false)
        }
    }, [cguAlert, dispatch])

    const openCapacitorSite = useCallback(async () => {
        // if(isWeb || true) {
        window.location.href = ssoUrl
        //     return
        // }
        // setError(undefined)
        // setLoadingStatus(true)
        // localStorage.removeItem("sso-token")
        // await Browser.removeAllListeners()
        // await Browser.open({ url: ssoUrl })
        // await Browser.addListener("browserFinished", validateSSOToken)
    }, [validateSSOToken])

    useEffect(() => {
        const query = new URLSearchParams(window.location.search)
        if (query.has("ticket")) {
            const ticket = query.get("ticket")
            if (ticket) {
                localStorage.setItem("sso-token", ticket)
                window.history.replaceState({}, document.title, window.location.pathname)
                validateSSOToken()
            }
        }
        console.log("e")
    }, [])

    return (
        <div className="h-full flex flex-col justify-end items-center overflow-y-auto relative">
            {error && <div className="bg-red-500 text-white p-2 rounded-md top-20 absolute">{error}</div>}
            <div className="flex-grow flex items-center">
                <button
                    onClick={openCapacitorSite}
                    disabled={loading}
                    className={`${loading && "cursor-not-allowed"} rounded-md flex items-center mt-8 py-2 px-4 bg-indigo-500 text-white hover:bg-indigo-600 transition-colors text-xl font-semibold`}
                >
                    <div className="mr-3">
                        { 
                            loading ?
                                <Loading /> :
                                <img src="./assets/moodle_m.svg" alt="Moodle logo" className="h-9" />
                        }
                    </div>
                    {t("login:sso_loggin")}
                </button>
            </div>
            <div className="flex flex-col items-center my-2">
                <div className="flex flex-row">
                    {SUPPORTED_LANGUAGES.map(lng => (
                        <img
                            key={lng}
                            className="mx-2 cursor-pointer"
                            src={`/img/flag/${lng}.jpg`}
                            onClick={() => i18n.changeLanguage(lng)}
                            style={{height: 30}}
                            alt={lng + " flag"}/>
                    ))}
                </div>
            </div>
            <span className="fixed top-2 left-0 w-full text-black/[15%] text-center">© IsepLive 2022</span>
            <a href="https://docs.iseplife.fr/cgu.html" target="_blank" className="absolute left-5 my-2 text-gray-400">
                CGU
            </a>
            <span className="absolute right-5 my-2 text-gray-400">
                {process.env.REACT_APP_VERSION} - {process.env.REACT_APP_COMMIT}
            </span>
        </div>
    )
}
export default Login
