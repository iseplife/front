import {StudentPreview} from "../student/types"

export type Group = {
    id: number
    name: string
    cover?: string
    restricted: boolean
    archived: boolean
    locked: boolean
    admins: StudentPreview[]
}

export type GroupForm = {
    name: string
    restricted: boolean
    admins: number[]
    cover?: File
    resetCover?: boolean
}