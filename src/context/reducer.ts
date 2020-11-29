import {AppAction, AppState} from "./action"

export type ContextReducerType = (action: AppAction) => void

export default function (state: any, action: AppAction): AppState {
    switch (action.type) {
        case "SET_PAYLOAD":
            return {...state, payload: action.payload}
        case "SET_STATE":
            return {...action.state}
        case "SET_STUDENT":
            return {...state, user: action.user}
        case "SET_PICTURE":
            return {
                ...state, user: {
                    ...state.user,
                    picture: action.payload.custom || action.payload.original
                }
            }
        default:
            return state
    }
}