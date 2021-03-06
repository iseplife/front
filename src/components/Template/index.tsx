import React, {useLayoutEffect, useState} from "react"
import {
    Redirect,
    Route,
    Switch, useHistory,
} from "react-router-dom"
import Interceptor from "./Interceptor"
import {getLoggedUser} from "../../data/student"
import Loading from "../Common/Loading"
import {Provider} from "react-redux"
import {getUser, isAdmin} from "../../data/security"

import rootReducer from "../../context/reducer"
import {createStore} from "redux"
import DefaultTemplate from "./Default"
import AdminTemplate from "./Admin"
import {getUserFeed} from "../../data/feed"
import LoadingPage from "../../pages/LoadingPage";


const Template: React.FC = () => {
    const [store, setStore] = useState()
    const [loading, setLoading] = useState<boolean>(true)

    useLayoutEffect(() => {
        Promise.all([getLoggedUser(), getUserFeed()]).then(res => {
            setStore(createStore(rootReducer, {
                user: res[0].data,
                payload: getUser(),
                feeds: res[1].data.reduce((acc, feed) => ({
                    ...acc,
                    [feed.id]: feed
                }), {})
            }))
        }).finally(() => setLoading(false))
    }, [])

    return loading ?
        <LoadingPage />
        :
        <Provider store={store}>
            <Interceptor/>
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
        </Provider>
}

export default Template