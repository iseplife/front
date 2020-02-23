import {Student} from "../student/types";
import {Club} from "../club/type";

export type PostCreation = {
    description: string
    private: boolean
    draft: boolean
    feed: number,
    linkedClub?: number
}


export type Post = {
    id: number
    description: string
    publicationDate: number
    creationDate: number
    private: boolean
    pinned: boolean
    author: Student
    embed: Embed
    linkedClub?: Club

    nbComments: number
    nbLikes: number
    liked: boolean
    hasWriteAccess: boolean
};

type Embed = {

};