import React, {useEffect, useState} from "react"
import {
    Redirect,
    Route,
    Switch,
} from "react-router-dom"
import Interceptor from "./Interceptor"
import {getLoggedUser} from "../../data/student"
import Loading from "../Common/Loading"
import {Provider} from "react-redux"
import {getUser, isAdmin} from "../../data/security"

import rootReducer from "../../redux/reducer"
import {createStore} from "redux"
import Navbar from "./Navbar"
import UserDrawer from "../User/UserDrawer"
import CustomGallery from "../../pages/gallery"
import DefaultTemplate from "./Default"
import AdminTemplate from "./Admin"


const Template: React.FC = () => {
    const [store, setStore] = useState()
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        getLoggedUser().then(res => {
            setStore(createStore(rootReducer, {user: res.data, payload: getUser()}))
            setLoading(false)
        })
    }, [])

    return loading ?
        <Loading/>
        :
        <Provider store={store}>
            <Interceptor/>
            <Switch>
                <Route path="/admin" render={({location}) =>
                    (
                        isAdmin() ?
                            <AdminTemplate/>
                            :
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