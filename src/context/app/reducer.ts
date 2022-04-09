import {AppContextState, DEFAULT_STATE} from "./context"
import {AppActionType, AppContextAction} from "./action"
import {parseToken} from "../../data/security"
import {apiClient} from "../../data/http"
import {logoutWebSocket} from "../../realtime/websocket/WSServerClient"
import GeneralEventType from "../../constants/GeneralEventType"


export const appContextReducer = (state: AppContextState, action: AppContextAction): AppContextState => {
    switch (action.type) {
        case AppActionType.SET_PAYLOAD:
            return {...state, payload: action.payload}
        case AppActionType.SET_STATE:
            return {...action.state}
        case AppActionType.SET_INITIALIZATION:
            return {
                ...state,
                user: action.payload.user,
                authors: action.payload.authors
            }
        case AppActionType.SET_LOGGED_OUT:
            delete apiClient.defaults.headers.common["Authorization"]
            localStorage.removeItem("logged")

            logoutWebSocket()
            window.dispatchEvent(new Event(GeneralEventType.LOGOUT))

            return DEFAULT_STATE as AppContextState
        case AppActionType.SET_TOKEN: {
            const parsedToken = parseToken(action.token)

            apiClient.defaults.headers.common["Authorization"] = `Bearer ${action.token}`
            return {
                ...state,
                jwt: action.token,
                payload: parsedToken.payload,
                token_expiration: parsedToken.exp * 1000 // convert seconds in ms
            }
        }
        case AppActionType.SET_TOKEN_EXPIRATION:
            return {...state, token_expiration: action.token_expiration * 1000} // convert secondes in ms
        case AppActionType.SET_PICTURE:
            return {
                ...state,
                user: {
                    ...state.user,
                    picture: action.payload.custom || action.payload.original
                }
            }
        default:
            return state
    }
}
