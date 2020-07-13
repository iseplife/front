import React from "react"
import {Redirect} from "react-router-dom"
import {logout} from "../../data/security"


const Logout: React.FC = () => {
    logout()
    return <Redirect to={"/login"} />
}

export default Logout
