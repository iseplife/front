import {Student} from "../student/types";
import {Club} from "../club/type";
import {Author} from "../request.type";

export type PostCreation = {
    description: string
    private: boolean
    draft: boolean
    feed: number
    linkedClub?: number
}

export type PostUpdate = {
    description: string
    private: boolean
    publicationDate: Date
}


export type Post = {
    id: number
    description: string
    publicationDate: number
    creationDate: number
    private: boolean
    pinned: boolean
    author: Author
    embed: Embed
    thread: number
    linkedClub?: Club

    nbComments: number
    nbLikes: number
    liked: boolean
    hasWriteAccess: boolean
};

type Embed = {

};
