import React, {Dispatch} from "react"
import {LoggedStudentPreview} from "../../data/student/types"
import {TokenPayload} from "../../data/security/types"
import {AppContextAction} from "./action"

export const DEFAULT_STATE: AppContextState = {
    token_expiration: 628021800000,
} as AppContextState



export type AppContextState =  {
    user: LoggedStudentPreview
    payload: TokenPayload
    jwt: string
    token_expiration: number  // in milliseconds
}


type AppContextType = {
    state: AppContextState
    dispatch: Dispatch<AppContextAction>
}
export const AppContext = React.createContext<AppContextType>({} as AppContextType)
