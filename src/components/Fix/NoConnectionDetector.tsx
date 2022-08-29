import { useContext, useEffect } from "react"
import { useHistory } from "react-router"
import { AppContext } from "../../context/app/context"
import { getAPIStatus } from "../../data/http"
import { LocationState } from "../../data/request.type"

const NoConnectionDetector = () => {
    const h = useHistory()
    const { state } = useContext(AppContext)

    // Maintenance redirection if API is down
    useEffect(() => {
        getAPIStatus().catch(() => {
            h.push( "/maintenance")
        }).then(() => {
            if(location.pathname == "/maintenance"){
                const from = (window.history.state?.state as LocationState)?.from || {
                    pathname: !state.payload || state.payload.lastConnection ? "/" : "/discovery"
                }
                h.push(from.pathname)
            }
        })
    }, [])
    return <></>
}

export default NoConnectionDetector