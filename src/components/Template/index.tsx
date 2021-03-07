import React, {useContext, useLayoutEffect, useState} from "react"
import {
    Redirect,
    Route,
    Switch,
} from "react-router-dom"
import {getLoggedUser} from "../../data/student"
import {getUser, isAdmin} from "../../data/security"

import DefaultTemplate from "./Default"
import AdminTemplate from "./Admin"
import LoadingPage from "../../pages/LoadingPage"
import {AppContext} from "../../context/app/context"
import {AppActionType} from "../../context/app/action"


const Template: React.FC = () => {
    const {dispatch} = useContext(AppContext)
    const [loading, setLoading] = useState<boolean>(true)

    useLayoutEffect(() => {
        getLoggedUser().then(res => {
            dispatch({type: AppActionType.SET_LOGGED_USER, payload: {
                user: res.data,
                payload: getUser(),
            }})
        }).finally(() => setLoading(false))
    }, [])

    return loading ?
        <LoadingPage/>
        :
        <Switch>
            <Route path="/admin" render={({location}) =>
                (
                    isAdmin() ?
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