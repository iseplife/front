import React, {Dispatch} from "react"
import {LoggedStudentPreview} from "../../data/student/types"
import {TokenPayload} from "../../data/security/types"
import {AppContextAction} from "./action"
import {Author} from "../../data/request.type"

export const DEFAULT_STATE: AppContextState = {
    authors: [] as Author[],
    token_expiration: 628021800000, // 18:30:00, 25 November 1989
} as AppContextState



export type AppContextState =  {
    user: LoggedStudentPreview
    authors: Author[]
    payload: TokenPayload
    jwt: string
    selectedPublisher: Author | undefined
    token_expiration: number  // in milliseconds
}


export type AppContextType = {
    state: AppContextState
    dispatch: Dispatch<AppContextAction>
}
export const AppContext = React.createContext<AppContextType>({} as AppContextType)
