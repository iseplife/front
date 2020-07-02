import React, {useState} from 'react';
import {Redirect, useHistory, useLocation} from 'react-router-dom';
import {useFormik} from 'formik';
import {useTranslation} from 'react-i18next';
import {connect, isLoggedIn} from "../../data/security";
import Loading from "../../components/Common/Loading";
import {SUPPORTED_LANGUAGES} from "../../i18n";

interface LoginFormInputs {
    id: string,
    password: string
}

const Login = () => {
    const initialValues: LoginFormInputs = {id: "", password: ""};
    const {t, i18n} = useTranslation(["login", "common"]);
    const history = useHistory();
    const location = useLocation();

    const [loading, setLoadingStatus] = useState<boolean>(false);
    const [error, setError] = useState<string|undefined>();
    const formik = useFormik<LoginFormInputs>({
        initialValues,
        onSubmit: ({id, password}) => {
            setLoadingStatus(true);
            connect(id, password)
                .catch(e => {
                    let msg;
                    if(e.response){
                        switch (e.response.status) {
                            case 401:
                                msg = "Mauvais mot de passe ou utilisateur";
                                break;
                            case 503:
                                msg = "Mauvais mot de passe ou utilisateur";
                                break;
                            default:
                                msg = "Serveur indisponible";
                        }
                    }else{
                        msg = "Serveur indisponible";
                    }
                    setError(msg);
                }).then(r => {
                    let { from } = location.state || { from: { pathname: "/" } };
                    history.replace(from);
                })
                .finally(() => {
                    setLoadingStatus(false);
                });
        }
    });

    return (
        <div className="h-full flex justify-center items-center">
            <div className="bg-white rounded-b shadow-lg p-4 flex flex-col">
                {isLoggedIn() && <Redirect to="/"/> }
                {error &&
                    <div className="text-center text-red-400">
                        <h6>{error}</h6>
                    </div>
                }
                <form className="flex justify-center flex-col" onSubmit={formik.handleSubmit}>
                    <input id="id" name="id" type="text" onChange={formik.handleChange}
                           required
                           placeholder={t("id")}
                           value={formik.values.id}
                           className="text-indigo-500 border border-indigo-200 m-3 py-2 px-5 rounded-full"
                    />
                    <input id="password" name="password" type="password" onChange={formik.handleChange}
                           required
                           placeholder={t("password")}
                           value={formik.values.password}
                           className="text-indigo-500 border border-indigo-200 m-3 py-2 px-5 rounded-full"
                    />
                    <button type="submit"
                            disabled={loading}
                            className={`${loading && "cursor-not-allowed"} rounded-full mt-8 py-2 px-4 bg-indigo-500 text-white hover:text-indigo-200 shadow-lg text-xl font-dinotcb`}
                    >
                        {loading ?
                            <Loading /> :
                            "let's go !"
                        }
                    </button>
                </form>
            </div>

            <div className="fixed bottom-0 flex flex-col items-center mb-2">
                <div className="flex flex-row">
                    {SUPPORTED_LANGUAGES.map(lng => (
                        <img key={lng} className="mx-2 cursor-pointer" src={`/img/flag/${lng}.jpg`} onClick={() => i18n.changeLanguage(lng)} style={{height: 30}} alt={lng + " flag"}/>
                    ))}
                </div>
                <span>{t("common:switch_lang")}</span>
            </div>
        </div>
    );
};
export default Login;