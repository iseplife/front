import {Club} from "../../data/club/types"

export enum ClubActionType {
    FETCH_CLUB,
    GET_CLUB,
    UPDATE_CLUB,
    FETCH_MEMBERS,
    GET_MEMBERS,
    ADD_MEMBER,
    REMOVE_MEMBER,
    UPDATE_MEMBER,
    TOGGLE_ADMIN_MODE
}

interface FetchClubAction {
    type: ClubActionType.FETCH_CLUB,
}
interface GetClubAction {
    type: ClubActionType.GET_CLUB,
    payload: Club
}

interface UpdateClubAction {
    type: ClubActionType.UPDATE_CLUB,
    payload: Club
}

interface ToggleAdminMode {
    type: ClubActionType.TOGGLE_ADMIN_MODE
}


export type ClubContextAction = FetchClubAction
    | GetClubAction
    | UpdateClubAction
    | ToggleAdminMode



