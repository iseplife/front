import {ClubContextState} from "./context"
import {ClubActionType, ClubContextAction} from "./action"


export const clubContextReducer = (state: ClubContextState, action: ClubContextAction): ClubContextState => {
    switch (action.type) {
        case ClubActionType.TOGGLE_ADMIN_MODE:
            return {
                ...state,
                adminMode: !state.adminMode
            }
        case ClubActionType.FETCH_CLUB:
            return {
                ...state,
                club: {
                    loading: true,
                    data: undefined
                },
            }
        case ClubActionType.GET_CLUB:
        case ClubActionType.UPDATE_CLUB:
            return {
                ...state,
                club: {
                    loading: false,
                    data: action.payload
                },
            }
    }
    return state
}
