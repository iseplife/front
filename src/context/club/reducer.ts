import {ClubContextState} from "./context"
import {ClubActionType, ClubContextAction} from "./action"


export const clubContextReducer = (state: ClubContextState, action: ClubContextAction): ClubContextState => {
    switch (action.type) {
        case ClubActionType.UPDATE_COVER:
            return {
                ...state,
                coverUrl: action.payload
            }
        case ClubActionType.UPDATE_LOGO:
            return {
                ...state,
                logoUrl: action.payload
            }
        case ClubActionType.GET_CLUB:
        case ClubActionType.UPDATE_CLUB:
            return {
                ...action.payload
            }
    }
    return state
}
