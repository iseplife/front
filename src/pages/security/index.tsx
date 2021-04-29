import React, {useContext, useState} from "react"
import {Redirect, useHistory, useLocation} from "react-router-dom"
import {useFormik} from "formik"
import {useTranslation} from "react-i18next"
import {connect, getToken, isLoggedIn} from "../../data/security"
import Loading from "../../components/Common/Loading"
import {SUPPORTED_LANGUAGES} from "../../i18n"
import {LocationState} from "../../data/request.type"
import {Input} from "antd"
import {AppContext} from "../../context/app/context"
import {AppActionType} from "../../context/app/action"


const initialValues: LoginFormInputs = {id: "", password: ""}

interface LoginFormInputs {
    id: string,
    password: string
}

const Login: React.FC = () => {
    const {t, i18n} = useTranslation(["login", "common"])
    const history = useHistory()
    const app = useContext(AppContext)
    const location = useLocation()

    const [loading, setLoadingStatus] = useState<boolean>(false)
    const [error, setError] = useState<string | undefined>()
    const formik = useFormik<LoginFormInputs>({
        initialValues,
        onSubmit: ({id, password}) => {
            setLoadingStatus(true)
            connect(id, password)
                .then((token) => {
                    app.dispatch({
                        type: AppActionType.SET_TOKEN_EXPIRATION,
                        token_expiration: getToken().exp
                    })

                    const {from} = (location.state as LocationState) || {
                        from: {
                            pathname: token.lastConnection ? "/" : "/discovery"
                        }
                    }
                    history.replace(from)
                })
                .catch(e => {
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
                })
        }
    })

    return (
        <div className="h-full flex flex-col justify-end items-center overflow-y-auto">
            <div className="flex-grow flex items-center">
                <div className="bg-white rounded-lg shadow-lg p-4 flex flex-col">
                    {isLoggedIn() && <Redirect to="/"/>}
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
                            className={`${loading && "cursor-not-allowed"} rounded-full mt-8 py-2 px-4 bg-indigo-500 text-white hover:text-indigo-200 shadow-lg text-xl font-dinotcb`}
                        >
                            {loading ?
                                <Loading/> :
                                "let's go !"
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
        </div>
    )
}
export default Login