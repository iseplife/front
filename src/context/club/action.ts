import {ClubContextState} from "./context"

export enum ClubActionType {
    GET_CLUB,
    UPDATE_CLUB,
    UPDATE_COVER,
    UPDATE_LOGO,
}


interface GetClubAction {
    type: ClubActionType.GET_CLUB,
    payload: ClubContextState
}

interface UpdateClubAction {
    type: ClubActionType.UPDATE_CLUB,
    payload: ClubContextState
}

interface UpdateClubCoverAction {
    type: ClubActionType.UPDATE_COVER,
    payload: ClubContextState["coverUrl"]
}

interface UpdateClubLogoAction {
    type: ClubActionType.UPDATE_LOGO,
    payload: ClubContextState["logoUrl"]
}



export type ClubContextAction = GetClubAction
    | UpdateClubAction
    | UpdateClubCoverAction
    | UpdateClubLogoAction



