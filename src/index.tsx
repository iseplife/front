import { App as IonicApp } from "@capacitor/app"
import { CapacitorUpdater } from "@capgo/capacitor-updater"
import { datadogRum } from "@datadog/browser-rum"
import { ResizeObserver as ResizeObserverPolyfill } from "@juggle/resize-observer"
import React, { useCallback, useEffect, useMemo, useReducer, useState } from "react"
import { createRoot } from "react-dom/client"
import {
    Redirect,
    Route,
    RouteComponentProps,
    BrowserRouter as Router,
    Switch,
} from "react-router-dom"
import { RecoilRoot } from "recoil"
import HeightFix from "./components/Fix/HeightFix"
import NotificationClickHandler from "./components/Notification/NotificationClickHandler"
import Template from "./components/Template"
import ErrorInterceptor from "./components/Template/ErrorInterceptor"
import GeneralEventType from "./constants/GeneralEventType"
import { AppActionType } from "./context/app/action"
import { AppContext, DEFAULT_STATE } from "./context/app/context"
import { appContextReducer } from "./context/app/reducer"
import { initializeAPIClient, tryMultipleTimes } from "./data/http"
import { apiURI, wsURI } from "./data/http.constants"
import { getAuthorizedAuthors } from "./data/post"
import { LocationState } from "./data/request.type"
import { refresh } from "./data/security"
import { getLoggedUser } from "./data/student"
import { notificationManager } from "./datamanager/NotificationManager"
import LoggedEvent from "./events/LoggedEvent"
import "./i18n"
import Maintenance from "./pages/errors/Maintenance"
import LoadingPage from "./pages/LoadingPage"
import Login from "./pages/security/Login"
import { initWebSocket, logoutWebSocket } from "./realtime/websocket/WSServerClient"
import UpdateService from "./services/UpdateService"
import * as serviceWorker from "./serviceWorker"

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css"
import "antd/dist/antd.min.css"
import "./index.css"

import { App as AppIonic, URLOpenListenerEvent } from "@capacitor/app"
import { Capacitor } from "@capacitor/core"
import { IonApp, setupIonicReact } from "@ionic/react"
import { AxiosError } from "axios"
import { isWeb } from "./data/app"
import UserPassLogin from "./pages/security/UserPassLogin"
import { isLocalhost } from "./util"

const isPRPreview = location.origin.endsWith("dev-github-pr.iseplife.fr")
const handleQueryRedirect = () => {
    const query = new URLSearchParams(window.location.search)
    if(query.has("redirect")) {
        const redirect = query.get("redirect")
        if(redirect)
            window.history.replaceState({}, "", redirect)
    }
}
if(isPRPreview)
    handleQueryRedirect()

setupIonicReact({
    mode: "ios",
    swipeBackEnabled: true
})

CapacitorUpdater.notifyAppReady()

window.React = React
window.ResizeObserver ??= ResizeObserverPolyfill

initializeAPIClient()
new UpdateService().init()

if(!isLocalhost && !isPRPreview) {
    const dataDogInit = (nativeVersion: string) => {
        const response = datadogRum.init({
            applicationId: "5a78df32-0770-4cbd-853c-984fd8a16809",
            clientToken: "pub00aecce089653075ee89a23fda9fb49c",
            site: "datadoghq.com",
            proxy: (options) => `https://dd.iseplife.fr${options.path}?${options.parameters}`,
            service: "iseplife-spa",
            env: process.env.NODE_ENV,
            version: `${process.env.REACT_APP_VERSION}-${process.env.REACT_APP_COMMIT}`,
            traceSampleRate: 100,
            sessionSampleRate: 100,
            sessionReplaySampleRate: 100,
            telemetrySampleRate: 100,
            trackUserInteractions: true,
            startSessionReplayRecordingManually: true,
            defaultPrivacyLevel: "mask",
            allowedTracingUrls : [ apiURI ],
            trackingConsent: "granted",
            excludedActivityUrls: [ /\/login$/, ],
            allowFallbackToLocalStorage: true,
            trackResources: true,
        })
        console.log(response)
    }
    if(isWeb)
        dataDogInit("web")
    else
        try {
            CapacitorUpdater.current().then(cu => dataDogInit(cu.native)).catch(e => {
                console.error(e)
                dataDogInit("unknown")
            })
        } catch(e) {
            console.error(e)
            dataDogInit("unknown")
        }
}

window.addEventListener(GeneralEventType.LOGGED, () => {
    console.debug("Logged !")
    if(!isLocalhost)
        datadogRum.startSessionReplayRecording()
})

console.log(`Loaded version: ${process.env.REACT_APP_VERSION}-g${process.env.REACT_APP_COMMIT}`)

const App: React.FC = () => {
    const [state, dispatch] = useReducer(appContextReducer, DEFAULT_STATE)
    const [isLoggedIn, setLoggedIn] = useState<boolean>()

    const [loading, setLoading] = useState<boolean>(true)
    const [noConnection, setNoConnection] = useState<boolean>(false)

    const getUserInfos = useCallback(() => {
        Promise.all([getLoggedUser(), getAuthorizedAuthors()]).then(([userRes, authorsRes]) => {
            const socket = initWebSocket(wsURI)
            dispatch({
                type: AppActionType.SET_INITIALIZATION,
                payload: {
                    user: userRes.data,
                    authors: authorsRes.data.sort((a, b) => a.name.localeCompare(b.name))
                }
            })

            if (localStorage.getItem("logged_id") != userRes.data.id.toString())
                window.dispatchEvent(new Event(GeneralEventType.LOGOUT))
            
            localStorage.setItem("logged_id", userRes.data.id.toString())
            window.dispatchEvent(new LoggedEvent({ state, dispatch }))

            notificationManager.setUnwatched(userRes.data.unwatchedNotifications)
            socket.connect({ state, dispatch })
            if (window.location.pathname.toLowerCase() == "/login" || window.location.pathname.toLowerCase() == "/alternative-login") {
                const from = (window.history.state?.state as LocationState)?.from || {
                    pathname: state.payload.lastConnection ? "/" : "/discovery"
                }
                window.history.replaceState({firstPage: true}, "", from.pathname)
            }
            setLoading(false)
        }).catch((e) => {
            console.error(e)
            setNoConnection(true)
            setLoading(false)
        })

        return () => logoutWebSocket()
    }, [state.payload])

    // Check user's state (logged in or not)
    useEffect(() => {
        setLoading(true)
        if (state.payload && state.token_expiration >= new Date().getTime()) {
            setLoggedIn(true)
            if (state.payload.id == state.user?.id)
                setLoading(false)
        } else if(localStorage.getItem("logged") === "1") {
            tryMultipleTimes(2, refresh).then(res => {
                dispatch({
                    type: AppActionType.SET_TOKEN,
                    token: res.data.token
                })
                setLoggedIn(true)
            }).catch((e) => {
                console.error(e)
                const err: AxiosError = e
                if(err.response?.status != 401)
                    setNoConnection(true)
                else
                    dispatch({
                        type: AppActionType.SET_LOGGED_OUT,
                    })
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

    useEffect(() => {
        if (Capacitor.getPlatform() === "android") {
            IonicApp.addListener("backButton", (data) => {
                if (data.canGoBack)
                    window.history.back()
            })
        }
    }, [])

    const renderTemplate = useMemo(() => {
        let savedLocation: RouteComponentProps
        return ({location}: RouteComponentProps) => isLoggedIn ?
            <Template/> : <>
                <Route path="/login" component={Login}/>
                <Redirect
                    to={{
                        pathname: "/login",
                        state: {from: savedLocation = savedLocation ?? location}
                    }}
                />
            </>
    }, [isLoggedIn])

    const redirectLogin =  useMemo(() =>
        <Route path="/" render={renderTemplate} />
    , [renderTemplate])

    // return (
    //     <IonApp>
    //         <AppContext.Provider value={{state, dispatch}}>
    //             <RecoilRoot>
    //                 <Router>
    //                     <ErrorInterceptor>
    //                         <HeightFix />
    //                         <NotificationClickHandler />
    //                         <DeepLinks />
    //                         {
    //                             loading || noConnection ? 
    //                                 <Switch>
    //                                     <Route path="*" component={noConnection ? Maintenance : LoadingPage} />
    //                                 </Switch>
    //                                 : isLoggedIn != undefined ?
    //                                     <Switch>
    //                                         {redirectLogin}
    //                                     </Switch> : <></>
    //                         }
    //                     </ErrorInterceptor>
    //                 </Router>
    //             </RecoilRoot>
    //         </AppContext.Provider>
    //     </IonApp>
    // )

    useEffect(() => {
        try{
            AppIonic.addListener("appUrlOpen", (event: URLOpenListenerEvent) => {
                const slug = event.url.split(".fr").pop()
                if (slug)
                    window.location.pathname = slug
            })
        }catch(e){
            console.error(e)
        }
    }, [])
    return (loading ? <LoadingPage /> : noConnection ? <Maintenance /> :
        <IonApp>
            <AppContext.Provider value={{state, dispatch}}>
                <RecoilRoot>
                    <Router>
                        <ErrorInterceptor>
                            <HeightFix />
                            <NotificationClickHandler />
                            <Switch>
                                <Route path="/login" component={Login}/>
                                <Route path="/alternative-login" component={UserPassLogin}/>
                                {redirectLogin}
                            </Switch>
                        </ErrorInterceptor>
                    </Router>
                </RecoilRoot>
            </AppContext.Provider>
        </IonApp>
    )
}

const root = createRoot(document.getElementById("root")!)
root.render(<App/>)

if(!isPRPreview && isWeb)
    serviceWorker.register()
