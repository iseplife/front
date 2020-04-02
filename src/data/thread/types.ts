import {Author} from "../request.type";

export type Comment = {
    id: number
    thread: number
    creation: number
    lastEdition?: number
    likes: number
    comments: number
    liked: boolean
    message: string
    author: Author
    hasWriteAccess: boolean
}