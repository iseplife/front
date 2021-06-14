import {AppContextState} from "./context"
import {AppActionType, AppContextAction} from "./action"


export const appContextReducer = (state: AppContextState, action: AppContextAction): AppContextState => {
    switch (action.type) {
        case AppActionType.SET_PAYLOAD:
            return {...state, payload: action.payload}
        case AppActionType.SET_STATE:
            return {...action.state}
        case AppActionType.SET_LOGGED_USER:
            return {
                ...state,
                user: action.payload.user,
                payload: action.payload.payload
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
