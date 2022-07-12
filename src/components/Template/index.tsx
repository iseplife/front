import React, {useContext, useEffect, useLayoutEffect, useMemo, useState} from "react"
import {
    Redirect,
    Route,
    Switch, useLocation
} from "react-router-dom"
import {getLoggedUser} from "../../data/student"

import DefaultTemplate from "./Default"
import AdminTemplate from "./Admin"
import LoadingPage from "../../pages/LoadingPage"
import {AppContext, AppContextType} from "../../context/app/context"
import {AppActionType} from "../../context/app/action"
import {Roles} from "../../data/security/types"
import {initWebSocket, logoutWebSocket} from "../../realtime/websocket/WSServerClient"
import { notificationManager } from "../../datamanager/NotificationManager"
import LoggedEvent from "../../events/LoggedEvent"
import GeneralEventType from "../../constants/GeneralEventType"
import {getAuthorizedAuthors} from "../../data/post"
import { wsURI } from "../../data/http.constants"
import useAdminRole from "../../hooks/useAdminRole"
import { arrayEquals } from "../../util"



const Template: React.FC = () => {
    const context = useContext<AppContextType>(AppContext)
    const { pathname } = useLocation()
    const [loading, setLoading] = useState<boolean>(true)
    const isAdmin = useAdminRole()

    useEffect(() => {
        Promise.all([getLoggedUser(), getAuthorizedAuthors()]).then(([userRes, authorsRes]) => {
            const socket = initWebSocket(wsURI)
            context.dispatch({
                type: AppActionType.SET_INITIALIZATION,
                payload: {
                    user: userRes.data,
                    authors: authorsRes.data
                }
            })

            if (localStorage.getItem("logged_id") != userRes.data.id.toString())
                window.dispatchEvent(new Event(GeneralEventType.LOGOUT))
            
            localStorage.setItem("logged_id", userRes.data.id.toString())
            window.dispatchEvent(new LoggedEvent(context))

            notificationManager.setUnwatched(userRes.data.unwatchedNotifications)
            socket.connect(context)
        }).finally(() => setLoading(false))

        return () => logoutWebSocket()
    }, [])

    const [,setPreviousUrl] = useState<string[]>([])

    useLayoutEffect(() => {
        setPreviousUrl(previousUrl => {
            const newSplitted = pathname.split("/")
            newSplitted.shift()

            if(!arrayEquals(newSplitted.slice(0, 2), previousUrl.slice(0, 2)))
                document.getElementById("main")?.scrollTo(0, 0)

            return newSplitted
        })
    }, [pathname])

    return loading ?
        <LoadingPage/> :
        <Switch>
            <Route path="/admin" render={({location}) =>
                (
                    isAdmin ?
                        <AdminTemplate/> :
                        <Redirect
                            to={{
                                pathname: "/404",
                                state: {from: location}
                            }}
                        />
                )}
            />
            <Route path="/" component={DefaultTemplate}/>
        </Switch>
}

export default Template
