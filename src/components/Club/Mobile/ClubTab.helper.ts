import React from "react"

export type Tab = {
    id: number,
    name?: string,
    icon?: string,
    isActive: boolean,
    component?: React.ReactNode
}

export const tabs: Tab[] = [
    { id: 0, name: "Members", isActive: true},
    { id: 1, name: "Posts", isActive: false},
    { id: 2, name: "Galleries", isActive: false},
    { id: 3, name: "About", isActive: false},
]