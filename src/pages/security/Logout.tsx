import React, {useContext, useEffect} from "react"
import {Redirect} from "react-router-dom"
import {AppContext} from "../../context/app/context"
import {AppActionType} from "../../context/app/action"


const Logout: React.FC = () => {
    const {dispatch} = useContext(AppContext)
    useEffect(() => {
        dispatch({type: AppActionType.SET_LOGGED_OUT})
    }, [])

    return <Redirect to="/login" />
}

export default Logout
