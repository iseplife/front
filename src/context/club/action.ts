import {Club} from "../../data/club/types"
import {ClubContextState} from "./context"

export enum ClubActionType {
    GET_CLUB,
    UPDATE_CLUB,
    UPDATE_SUB,
    UPDATE_COVER,
    UPDATE_CACHE,
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
    payload: Club["coverUrl"]
}

interface UpdateClubLogoAction {
    type: ClubActionType.UPDATE_LOGO,
    payload: Club["logoUrl"]
}

interface UpdateClubSubAction {
    type: ClubActionType.UPDATE_SUB,
    payload: Club["subscribed"]
}

interface UpdateClubCacheAction {
    type: ClubActionType.UPDATE_CACHE,
    payload: ClubContextState["cache"]
}



export type ClubContextAction = GetClubAction
    | UpdateClubAction
    | UpdateClubCoverAction
    | UpdateClubLogoAction
    | UpdateClubSubAction
    | UpdateClubCacheAction