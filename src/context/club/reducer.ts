import {ClubContextState} from "./context"
import {ClubActionType, ClubContextAction} from "./action"


export const clubContextReducer = (state: ClubContextState, action: ClubContextAction): ClubContextState => {
    switch (action.type) {
        case ClubActionType.UPDATE_COVER:
            return {
                ...state,
                club: {
                    ...state.club!,
                    coverUrl: action.payload
                }
            }
        case ClubActionType.UPDATE_LOGO:
            return {
                ...state,
                club: {
                    ...state.club!,
                    logoUrl: action.payload
                }
            }
        case ClubActionType.UPDATE_SUB:
            return {
                ...state,
                club: {
                    ...state.club!,
                    subscribed: action.payload
                }
            }
        case ClubActionType.UPDATE_CACHE:
            return {
                ...state,
                cache: action.payload
            }
        case ClubActionType.GET_CLUB:
        case ClubActionType.UPDATE_CLUB:
            return {
                ...state,
                club: {
                    ...state.club,
                    ...action.payload
                }
            }
    }
    return state
}
