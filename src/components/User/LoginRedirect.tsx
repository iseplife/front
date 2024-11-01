import { useContext, useEffect } from "react"
import { useHistory } from "react-router"
import GeneralEventType from "../../constants/GeneralEventType"
import { AppContext } from "../../context/app/context"
import { LocationState } from "../../data/request.type"

const LoginRedirect = () => {
    const {state} = useContext(AppContext)
    const history = useHistory()
    useEffect(() => {
        const handler = () => {
            if (window.location.pathname.toLowerCase() == "/login" || window.location.pathname.toLowerCase() == "/alternative-login") {
                const from = (window.history.state?.state as LocationState)?.from || {
                    pathname: state.payload.lastConnection ? "/" : "/discovery"
                }
                history.replace(from.pathname, {firstPage: true})
            }
        }
        window.addEventListener(GeneralEventType.LOGGED, handler)
        return () => window.removeEventListener(GeneralEventType.LOGGED, handler)
    }, [state])

    return <></>
}

export default LoginRedirect
