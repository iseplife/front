import React, {Dispatch} from "react"
import {LazyLoad} from "../../data/request.type"
import {Club as ClubType, ClubMember} from "../../data/club/types"
import {ClubContextAction} from "./action"

export const DEFAULT_STATE: ClubContextState = {
    club: {
        loading: false,
    },
    members: {
        loading: false,
        data: []
    },
    adminMode: false
}

export type ClubContextState = {
    club: LazyLoad<ClubType>
    members: {
        loading: boolean
        data: ClubMember[]
    }
    adminMode: boolean
}

type ClubContext = {
    state: ClubContextState;
    dispatch: Dispatch<ClubContextAction>;
}
export const ClubContext = React.createContext<ClubContext>({} as ClubContext)