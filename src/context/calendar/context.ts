import React from "react"


export type CalendarContextType = {
    feeds: Record<number, string>
}

export const CalendarContext = React.createContext<CalendarContextType>({feeds: {}})