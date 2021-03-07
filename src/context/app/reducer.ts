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
        case AppActionType.SET_REFRESHING:
            return {...state, refreshing: action.refreshing}
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