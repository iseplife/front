import {Club} from "../../data/club/types"

export enum ClubActionType {
    GET_CLUB,
    UPDATE_CLUB,
    UPDATE_COVER,
    UPDATE_LOGO,
}


interface GetClubAction {
    type: ClubActionType.GET_CLUB,
    payload: Club
}

interface UpdateClubAction {
    type: ClubActionType.UPDATE_CLUB,
    payload: Club
}

interface UpdateClubCoverAction {
    type: ClubActionType.UPDATE_COVER,
    payload: string
}

interface UpdateClubLogoAction {
    type: ClubActionType.UPDATE_LOGO,
    payload: string
}



export type ClubContextAction = GetClubAction
    | UpdateClubAction
    | UpdateClubCoverAction
    | UpdateClubLogoAction



