import React, {useContext, useState} from "react"
import {useHistory} from "react-router-dom"
import {useFormik} from "formik"
import {useTranslation} from "react-i18next"
import {connect, parseToken} from "../../data/security"
import Loading from "../../components/Common/Loading"
import {SUPPORTED_LANGUAGES} from "../../i18n"
import {LocationState} from "../../data/request.type"
import {Input} from "antd"
import {AppContext} from "../../context/app/context"
import {AppActionType} from "../../context/app/action"


interface LoginFormInputs {
    id: string,
    password: string
}

const Login: React.FC = () => {
    const {t, i18n} = useTranslation(["login", "common"])
    const {dispatch} = useContext(AppContext)
    const history = useHistory()

    const [loading, setLoadingStatus] = useState<boolean>(false)
    const [error, setError] = useState<string | undefined>()
    const formik = useFormik<LoginFormInputs>({
        initialValues: {id: "", password: ""},
        onSubmit: ({id, password}) => {
            setLoadingStatus(true)
            connect(id, password).then((res) => {
                dispatch({
                    type: AppActionType.SET_TOKEN,
                    token: res.data.token
                })
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
            <span className="absolute right-5 my-2 text-gray-400">
                {process.env.REACT_APP_VERSION}
            </span>
        </div>
    )
}
export default Login
