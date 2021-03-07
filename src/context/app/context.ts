import React, {Dispatch} from "react"
import {StudentPreview} from "../../data/student/types"
import {TokenPayload} from "../../data/security/types"
import {AppContextAction} from "./action"

export const DEFAULT_STATE: AppContextState = {
    refreshing: false,
} as AppContextState



export type AppContextState =  {
    user: StudentPreview
    payload: TokenPayload
    refreshing: boolean
}


type AppContextType = {
    state: AppContextState
    dispatch: Dispatch<AppContextAction>
}
export const AppContext = React.createContext<AppContextType>({} as AppContextType)