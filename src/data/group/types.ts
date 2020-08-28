import {StudentPreview} from "../student/types"

export type GroupPreview = {
    id: number,
    name: string,
    cover?: string
}

export type Group = {
    id: number
    name: string
    cover?: string
    restricted: boolean
    archived: boolean
    locked: boolean
    feed: number
    members: GroupMember[]
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