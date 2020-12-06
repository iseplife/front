import {Author} from "../request.type"

export type Comment = {
    id: number
    thread: number
    creation: Date
    lastEdition?: Date
    likes: number
    comments: number
    liked: boolean
    message: string
    author: Author
    hasWriteAccess: boolean
}

export type CommentForm = {
    message: string
    asClub?: number
}