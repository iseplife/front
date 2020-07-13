import {AppAction, AppState} from "./types"

export default function (state: any,  action: AppAction): AppState {
    switch (action.type) {
        case "SET_PAYLOAD":
            return {...state, payload: action.payload}
        case "SET_STATE":
            return {...action.state}
        case "SET_STUDENT":
            return {...state, student: action.user}
        default:
            return state
    }
}