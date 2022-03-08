import React, {useContext, useLayoutEffect, useMemo, useState} from "react"
import {
    Redirect,
    Route,
    Switch
} from "react-router-dom"
import {getLoggedUser} from "../../data/student"

import DefaultTemplate from "./Default"
import AdminTemplate from "./Admin"
import LoadingPage from "../../pages/LoadingPage"
import {AppContext} from "../../context/app/context"
import {AppActionType} from "../../context/app/action"
import {Roles} from "../../data/security/types"
import {wsURI} from "../../data/http"
import {getWebSocket, initWebSocket} from "../../realtime/websocket/WSServerClient"
import { getUserGroups } from "../../data/group"
import { notificationManager } from "../../datamanager/NotificationManager"


const Template: React.FC = () => {
    const {state, dispatch} = useContext(AppContext)
    const [loading, setLoading] = useState<boolean>(true)
    const isAdmin = useMemo(() => (
        state.payload.roles.includes(Roles.ADMIN)
    ), [state.payload])

    useLayoutEffect(() => {
        Promise.all([getLoggedUser(), getUserGroups()]).then(res => {
            const socket = initWebSocket(wsURI)
            dispatch({
                type: AppActionType.SET_LOGGED_USER,
                user: {
                    ...res[0].data,
                    groups: res[1].data,
                }
            })

            if (localStorage.getItem("logged_id") != res[0].data.id.toString())
                window.dispatchEvent(new Event("logout"))
            
            localStorage.setItem("logged_id", res[0].data.id.toString())
            
            window.dispatchEvent(new Event("logged"))

            notificationManager.setUnwatched(res[0].data.unwatchedNotifications)
            res[0].data.unwatchedNotifications = undefined!

            socket.connect(state.jwt)
        }).finally(() => setLoading(false))

        return () => getWebSocket() && getWebSocket().disconnect()
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
