import {StudentPreview} from "../student/types";

export type Feed = {
    id: number
    name: string
    cover?: string
    restricted: boolean
    archived: boolean
    admins: StudentPreview[]
}

export type FeedForm = {
    id: number
    name: string
    restricted: boolean
    admins: number[]
    cover?: File
    resetCover?: boolean
}