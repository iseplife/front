import {ClubContextState} from "./context"
import {ClubActionType, ClubContextAction} from "./action"


export const clubContextReducer = (club: ClubContextState, action: ClubContextAction): ClubContextState => {
    switch (action.type) {
        case ClubActionType.UPDATE_COVER:
            return {
                ...club,
                coverUrl: action.payload
            }
        case ClubActionType.UPDATE_LOGO:
            return {
                ...club,
                logoUrl: action.payload
            }
        case ClubActionType.GET_CLUB:
        case ClubActionType.UPDATE_CLUB:
            return {
                ...action.payload
            }
    }
    return club
}
