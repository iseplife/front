import React from "react"


export type FeedsContextType = Record<number, string>

export const FeedsContext = React.createContext<FeedsContextType>({})