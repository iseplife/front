import React, {useEffect, useReducer, useState} from "react"
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
import Login from "./pages/security"
import {refresh} from "./data/security"
import Template from "./components/Template"
import {RecoilRoot} from "recoil"
import {AppContext, DEFAULT_STATE} from "./context/app/context"
import {appContextReducer} from "./context/app/reducer"
import Interceptor from "./components/Template/Interceptor"
import {AppActionType} from "./context/app/action"

initializeAPIClient()
const App: React.FC = () => {
    const [state, dispatch] = useReducer(appContextReducer, DEFAULT_STATE)
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>()

    // Check user's state (logged in or not)
    useEffect(() => {
        if (state.payload && state.token_expiration >= new Date().getTime()) {
            setIsLoggedIn(true)
        } else {
            refresh().then(res => {
                dispatch({
                    type: AppActionType.SET_TOKEN,
                    token: res.data.token
                })
                setIsLoggedIn(true)
            }).catch(e => {
                console.error(e)    // Token refreshing failed
                setIsLoggedIn(false)
            })
        }
    }, [state.token_expiration])

    return (
        <AppContext.Provider value={{state, dispatch}}>
            <RecoilRoot>
                {isLoggedIn != undefined && (
                    <Router>
                        <Interceptor/>
                        <Switch>
                            <Route path="/login" component={Login}/>
                            <Route path="/" render={({location}) => (
                                isLoggedIn ?
                                    <Template/> :
                                    <Redirect
                                        to={{
                                            pathname: "/login",
                                            state: {from: location}
                                        }}
                                    />
                            )}
                            />
                        </Switch>
                    </Router>
                )}
            </RecoilRoot>
        </AppContext.Provider>
    )
}

ReactDOM.render(<App/>, document.getElementById("root"))
serviceWorker.register()
