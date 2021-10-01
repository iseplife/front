import React, {useContext, useEffect} from "react"
import {Redirect} from "react-router-dom"
import {AppContext} from "../../context/app/context"
import {AppActionType} from "../../context/app/action"
import {logout} from "../../data/security"


const Logout: React.FC = () => {
    const {dispatch} = useContext(AppContext)
    useEffect(() => {
        logout().then(() => {
            dispatch({type: AppActionType.SET_LOGGED_OUT})
        })
    }, [])

    return <Redirect to="/login" />
}

export default Logout
