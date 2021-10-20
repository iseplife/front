import React, {Dispatch} from "react"
import {LazyLoad} from "../../data/request.type"
import {Club as ClubType} from "../../data/club/types"
import {ClubContextAction} from "./action"

export const DEFAULT_STATE: ClubContextState = {
    club: {
        loading: true,
        data: undefined
    },
    adminMode: false
}

export type ClubContextState = {
    club: LazyLoad<ClubType>
    adminMode: boolean
}

type ClubContext = {
    state: ClubContextState
    dispatch: Dispatch<ClubContextAction>
}
export const ClubContext = React.createContext<ClubContext>({} as ClubContext)
