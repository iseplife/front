import {StudentPreview} from "../student/types"

export type GroupPreview = {
    id: number,
    feedId: number,
    name: string,
    restricted: boolean
    archived: boolean
}

export type Group = {
    id: number
    name: string
    cover?: string
    restricted: boolean
    archived: boolean
    feedId: number
    hasRight: boolean
    subscribed: { extensive: boolean }
}

export type GroupAdmin = Omit<Group, "subscribed" | "hasRight" | "feed"> & {
    locked: boolean
    admins: GroupMember[]
}

export type GroupMember = {
    id: number
    admin: boolean
    student: StudentPreview
}

export type GroupForm = {
    name: string
    restricted: boolean
    admins: number[]
    cover?: File
}