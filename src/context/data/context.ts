import React, {Dispatch} from "react"
import {Club as ClubType} from "../../data/club/types"
import {DataActionType} from "./action"


export type DataContextState = ClubType

type DataContext = {
    club: DataContextState
    dispatch: Dispatch<DataActionType>
}
export const ClubContext = React.createContext<DataContext>({} as DataContext)
