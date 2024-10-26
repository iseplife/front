import React, {useContext, useEffect} from "react"
import {Redirect} from "react-router-dom"
import {AppContext} from "../../context/app/context"
import {AppActionType} from "../../context/app/action"
import {logout} from "../../data/security"
import { isWeb } from "../../data/app"


const Logout: React.FC = () => {
    const {dispatch} = useContext(AppContext)
    useEffect(() => {
        if(isWeb)
            logout().then(() => {
                dispatch({type: AppActionType.SET_LOGGED_OUT})
            })
        else {
            dispatch({type: AppActionType.SET_LOGGED_OUT})
        }
    }, [])

    return <Redirect to="/login" />
}

export default Logout
