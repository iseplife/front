import React, {useContext, useState} from "react"
import {useFormik} from "formik"
import {useTranslation} from "react-i18next"
import {connect} from "../../data/security"
import Loading from "../../components/Common/Loading"
import {SUPPORTED_LANGUAGES} from "../../i18n"
import {Input} from "antd"
import {AppContext} from "../../context/app/context"
import {AppActionType} from "../../context/app/action"
import { isWeb } from "../../data/app"
import { useIonAlert } from "@ionic/react"
import {apiClient} from "../../data/http"


interface LoginFormInputs {
    id: string,
    password: string
}

const Login: React.FC = () => {
    const {t, i18n} = useTranslation(["login", "common"])
    const {dispatch} = useContext(AppContext)

    const [loading, setLoadingStatus] = useState<boolean>(false)
    const [error, setError] = useState<string | undefined>()
    const [presentAlert] = useIonAlert()
    const formik = useFormik<LoginFormInputs>({
        initialValues: {id: "", password: ""},
        onSubmit: ({id, password}) => {
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
                        handler: () => {
                            setLoadingStatus(true)
                
                            connect(id, password).then((res) => {
                                localStorage.removeItem("pushTokenValue")
                                
                                dispatch({
                                    type: AppActionType.SET_TOKEN,
                                    token: res.data.token
                                })
                                if(!isWeb)
                                    localStorage.setItem("refresh", res.data.refreshToken)
                                localStorage.setItem("logged", "1")
                            }).catch(e => {
                                setLoadingStatus(false)
                                let msg
                                if (e.response) {
                                    switch (e.response.status) {
                                        case 401:
                                            msg = "Mauvais mot de passe ou utilisateur"
                                            break
                                        case 503:
                                            msg = "Mauvais mot de passe ou utilisateur"
                                            break
                                        default:
                                            msg = "Serveur indisponible"
                                    }
                                } else {
                                    msg = "Serveur indisponible"
                                }
                                setError(msg)
                            }).finally(() => setLoadingStatus(false))
                        },
                    },
                ]
            })
        }
    })

    return (
        <div className="h-full flex flex-col justify-end items-center overflow-y-auto relative">
            <div className="flex-grow flex items-center">
                <div className="bg-white rounded-lg shadow-lg p-4 flex flex-col">
                    {error && (
                        <div className="text-center">
                            <h6 className="text-red-600">{error}</h6>
                        </div>
                    )}
                    <form className="flex flex-col justify-center " onSubmit={formik.handleSubmit}>
                        <Input
                            name="id" type="text" onChange={formik.handleChange}
                            required
                            placeholder={t("id")}
                            value={formik.values.id}
                            className="w-auto text-center text-indigo-500 border border-indigo-200 m-3 py-2 px-5 rounded-full"
                        />
                        <Input
                            id="password" name="password" type="password" onChange={formik.handleChange}
                            required
                            placeholder={t("password")}
                            value={formik.values.password}
                            className="w-auto text-center text-indigo-500 border border-indigo-200 m-3 py-2 px-5 rounded-full"
                        />

                        <button
                            type="submit"
                            disabled={loading}
                            className={`${loading && "cursor-not-allowed"} rounded-full mt-8 py-2 px-4 bg-indigo-500 text-white hover:text-indigo-200 transition-colors shadow-lg text-xl font-semibold`}
                        >
                            {loading ?
                                <Loading/> :
                                t("login:submit")
                            }
                        </button>
                        <div className="text-black/40 text-center mt-2 -mb-1 max-w-[200px] mx-auto">{t("login:use_moodle")}</div>
                    </form>
                </div>
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
