import {Author} from "../request.type"

export type ThreadState = {
    id: number
    liked: boolean
    nbLikes: number
    nbComments: number
}

export type Comment = {
    id: number
    thread: number
    creation: Date
    lastEdition?: Date
    likes: number
    oldLikes?: number
    comments: number
    liked: boolean
    message: string
    author: Author
    hasWriteAccess: boolean
}

export type CommentUpdate = {
    id: number
    thread: number
    author: Author
    message: string
    lastEdition: Date
}

export type CommentForm = {
    message: string
    asClub?: number
}