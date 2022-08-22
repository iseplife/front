import React, {Dispatch} from "react"
import {Club as ClubType, ClubPreview} from "../../data/club/types"
import { Author } from "../../data/request.type"
import { SearchItem } from "../../data/searchbar/types"
import {ClubContextAction} from "./action"

export const DEFAULT_STATE: ClubContextState = {} as ClubContextState

export type ClubContextState = {
    cache?: Partial<Author & ClubPreview & SearchItem> & (Author | ClubPreview | SearchItem)
    club?: ClubType
}

type ClubContext = {
    state: ClubContextState
    dispatch: Dispatch<ClubContextAction>
}
export type ClubContextWithClub = {
    state: {
        cache?: Partial<Author & ClubPreview> & (Author | ClubPreview)
        club: ClubType
    }
    dispatch: Dispatch<ClubContextAction>
}
export const ClubContext = React.createContext<ClubContext>({} as ClubContext)
