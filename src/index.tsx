import React, {useCallback, useEffect, useReducer, useState} from "react"
import { createRoot } from "react-dom/client"
import * as serviceWorker from "./serviceWorker"
import "./i18n"
import {
    BrowserRouter as Router,
    Route,
    Switch,
    Redirect,
} from "react-router-dom"
import {getAPIStatus, initializeAPIClient} from "./data/http"
import Login from "./pages/security/Login"
import {refresh} from "./data/security"
import Template from "./components/Template"
import {RecoilRoot} from "recoil"
import {AppContext, DEFAULT_STATE} from "./context/app/context"
import {appContextReducer} from "./context/app/reducer"
import Interceptor from "./components/Template/Interceptor"
import {AppActionType} from "./context/app/action"
import {RouteComponentProps} from "react-router-dom"
import "./index.css"
import "antd/dist/antd.min.css"
import Maintenance from "./pages/errors/Maintenance"
import HeightFix from "./components/Fix/HeightFix"
import { getLoggedUser } from "./data/student"
import { getAuthorizedAuthors } from "./data/post"
import { initWebSocket, logoutWebSocket } from "./realtime/websocket/WSServerClient"
import { wsURI } from "./data/http.constants"
import GeneralEventType from "./constants/GeneralEventType"
import LoggedEvent from "./events/LoggedEvent"
import { notificationManager } from "./datamanager/NotificationManager"
import LoadingPage from "./pages/LoadingPage"
import { LocationState } from "./data/request.type"

window.React = React

initializeAPIClient()
const App: React.FC = () => {
    const [state, dispatch] = useReducer(appContextReducer, DEFAULT_STATE)
    const [isLoggedIn, setLoggedIn] = useState<boolean>()
    const [maintenance, setMaintenance] = useState<boolean>(false)

    // Maintenance redirection if API is down
    useEffect(() => {
        getAPIStatus().catch(() => setMaintenance(true))
    }, [])

    const [loading, setLoading] = useState<boolean>(true)
    const getUserInfos = useCallback(() => {
        Promise.all([getLoggedUser(), getAuthorizedAuthors()]).then(([userRes, authorsRes]) => {
            const socket = initWebSocket(wsURI)
            dispatch({
                type: AppActionType.SET_INITIALIZATION,
                payload: {
                    user: userRes.data,
                    authors: authorsRes.data
                }
            })

            if (localStorage.getItem("logged_id") != userRes.data.id.toString())
                window.dispatchEvent(new Event(GeneralEventType.LOGOUT))
            
            localStorage.setItem("logged_id", userRes.data.id.toString())
            window.dispatchEvent(new LoggedEvent({ state, dispatch }))

            notificationManager.setUnwatched(userRes.data.unwatchedNotifications)
            socket.connect({ state, dispatch })
            if (window.location.pathname.toLowerCase() == "/login") {
                const from = (window.history.state as LocationState)?.from || {
                    pathname: state.payload.lastConnection ? "/" : "/discovery"
                }
                history.pushState(null, "", from.pathname)
            }
        }).catch((e) => {
            console.error(e)
            setLoggedIn(false)
        }).finally(() => 
            setLoading(false))

        return () => logoutWebSocket()
    }, [state.payload])

    // Check user's state (logged in or not)
    useEffect(() => {
        setLoading(true)
        if (state.payload && state.token_expiration >= new Date().getTime()) {
            setLoggedIn(true)
            if (state.payload.id == state.user?.id)
                setLoading(false)
        } else if(localStorage.getItem("logged") == "1") {
            refresh().then(res => {
                dispatch({
                    type: AppActionType.SET_TOKEN,
                    token: res.data.token
                })
                setLoggedIn(true)
            }).catch(() => {
                setLoggedIn(false)
                setLoading(false)
            })
        } else {
            setLoggedIn(false)
            setLoading(false)
        }
    }, [state.payload, state.token_expiration, state.user, getUserInfos])

    useEffect(() => {
        if(isLoggedIn)
            getUserInfos()
    }, [isLoggedIn])

    const renderTemplate = useCallback(({location}: RouteComponentProps) => isLoggedIn ?
        <Template/> :
        <Redirect
            to={{
                pathname: "/login",
                state: {from: location}
            }}
        />
    , [isLoggedIn])

    return (loading ? <LoadingPage /> :
        <AppContext.Provider value={{state, dispatch}}>
            <RecoilRoot>
                {isLoggedIn != undefined && (
                    <Router>
                        <Interceptor />
                        <HeightFix />
                        <Switch>
                            <Route path="/maintenance" component={Maintenance}/>
                            {maintenance && <Redirect to="/maintenance" />}

                            <Route path="/login" component={Login}/>
                            <Route path="/" render={renderTemplate} />
                        </Switch>
                    </Router>
                )}
            </RecoilRoot>
        </AppContext.Provider>
    )
}

const root = createRoot(document.getElementById("root")!)
root.render(<App/>)
serviceWorker.register()
