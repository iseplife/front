import {StudentPreview} from "../student/types";

export type Feed = {
    id: number
    name: string
    admins: StudentPreview[]
}

export type FeedForm = {
    name: string
    admins: number[]
}