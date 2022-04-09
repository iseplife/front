import React, {useContext, useEffect, useMemo, useState} from "react"
import {
    Redirect,
    Route,
    Switch
} from "react-router-dom"
import {getLoggedUser} from "../../data/student"

import DefaultTemplate from "./Default"
import AdminTemplate from "./Admin"
import LoadingPage from "../../pages/LoadingPage"
import {AppContext, AppContextType} from "../../context/app/context"
import {AppActionType} from "../../context/app/action"
import {Roles} from "../../data/security/types"
import {wsURI} from "../../data/http"
import {initWebSocket, logoutWebSocket} from "../../realtime/websocket/WSServerClient"
import { notificationManager } from "../../datamanager/NotificationManager"
import LoggedEvent from "../../events/LoggedEvent"
import GeneralEventType from "../../constants/GeneralEventType"
import {getAuthorizedAuthors} from "../../data/post"



const Template: React.FC = () => {
    const context = useContext<AppContextType>(AppContext)
    const [loading, setLoading] = useState<boolean>(true)
    const isAdmin = useMemo(() => (
        context.state.payload.roles.includes(Roles.ADMIN)
    ), [context.state.payload])

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
