import React, {useCallback, useEffect, useReducer, useState} from "react"
import ReactDOM from "react-dom"
import * as serviceWorker from "./serviceWorker"
import "./i18n"
import {
    BrowserRouter as Router,
    Route,
    Switch,
    Redirect
} from "react-router-dom"
import {initializeAPIClient} from "./data/http"
import Login from "./pages/security/Login"
import {refresh} from "./data/security"
import Template from "./components/Template"
import {RecoilRoot} from "recoil"
import {AppContext, DEFAULT_STATE} from "./context/app/context"
import {appContextReducer} from "./context/app/reducer"
import Interceptor from "./components/Template/Interceptor"
import {AppActionType} from "./context/app/action"
import { RouteComponentProps } from "react-router"
import "./index.css"
import "antd/dist/antd.min.css"

initializeAPIClient()
const App: React.FC = () => {
    const [state, dispatch] = useReducer(appContextReducer, DEFAULT_STATE)
    const [isLoggedIn, setLoggedIn] = useState<boolean>()
    const renderTemplate = useCallback(({location}: RouteComponentProps) => (
        isLoggedIn ?
            <Template/> :
            <Redirect
                to={{
                    pathname: "/login",
                    state: {from: location}
                }}
            />
    ), [isLoggedIn])


    // Check user's state (logged in or not)
    useEffect(() => {
        if (state.payload && state.token_expiration >= new Date().getTime()) {
            setLoggedIn(true)
        } else if(localStorage.getItem("logged")) {
            refresh().then(res => {
                dispatch({
                    type: AppActionType.SET_TOKEN,
                    token: res.data.token
                })
                setLoggedIn(true)
            }).catch(() => {
                setLoggedIn(false)
            })
        }else {
            setLoggedIn(false)
        }
    }, [state.payload, state.token_expiration])

    return (
        <AppContext.Provider value={{state, dispatch}}>
            <RecoilRoot>
                {isLoggedIn != undefined && (
                    <Router>
                        <Interceptor/>
                        <Switch>
                            <Route path="/login" component={Login}/>
                            <Route path="/" render={renderTemplate}/>
                        </Switch>
                    </Router>
                )}
            </RecoilRoot>
        </AppContext.Provider>
    )
}

ReactDOM.render(<App/>, document.getElementById("root"))
serviceWorker.register()
