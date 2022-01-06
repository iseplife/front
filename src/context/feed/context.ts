import React from "react"
import {Author} from "../../data/request.type"

export type FeedContextType = {
    authors: Author[]
}

export const FeedContext = React.createContext<FeedContextType | undefined>(undefined)