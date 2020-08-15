import {Club, ClubMember} from "../../data/club/types"

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

interface FetchMembersAction {
    type: ClubActionType.FETCH_MEMBERS,
}
interface GetMembersAction {
    type: ClubActionType.GET_MEMBERS,
    payload: ClubMember[]
}


interface AddClubMember {
    type: ClubActionType.ADD_MEMBER,
    payload: ClubMember
}

interface UpdateClubMember {
    type: ClubActionType.UPDATE_MEMBER,
    payload: ClubMember
}

interface RemoveClubMember {
    type: ClubActionType.REMOVE_MEMBER,
    payload: number
}

interface ToggleAdminMode {
    type: ClubActionType.TOGGLE_ADMIN_MODE
}


export type ClubContextAction = FetchClubAction
    | GetClubAction
    | UpdateClubAction
    | FetchMembersAction
    | GetMembersAction
    | AddClubMember
    | UpdateClubMember
    | RemoveClubMember
    | ToggleAdminMode



