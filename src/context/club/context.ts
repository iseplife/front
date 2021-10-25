import React, {Dispatch} from "react"
import {Club as ClubType} from "../../data/club/types"
import {ClubContextAction} from "./action"

export const DEFAULT_STATE: ClubContextState = {} as ClubContextState

export type ClubContextState = ClubType

type ClubContext = {
    club: ClubContextState
    dispatch: Dispatch<ClubContextAction>
}
export const ClubContext = React.createContext<ClubContext>({} as ClubContext)
