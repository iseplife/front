import {Club} from "../club/types"
import {Author} from "../request.type"
import {Gallery, GalleryPreForm} from "../gallery/types"
import {Image, Video, Document} from "../media/types"
import {Poll} from "../poll/types";


export enum EmbedEnumType {
    GALLERY = "gallery",
    POLL = "poll",
    DOCUMENT = "document",
    VIDEO = "video",
    IMAGE = "image",
}

export type PostCreation = {
    description: string
    private: boolean
    draft: boolean
    feed: number
    linkedClub?: number
    attachements:  { [type: string]: number }
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




type EmbedGallery = Gallery & {
    embedType: EmbedEnumType.GALLERY
}
type EmbedMedia = Image | Video | Document
export type Embed = EmbedGallery | EmbedMedia | Poll



type EmbedGalleryCreation = {
    type: EmbedEnumType.GALLERY
    data: GalleryPreForm
}
type EmbedMediaCreation = {
    type: EmbedEnumType.DOCUMENT | EmbedEnumType.VIDEO | EmbedEnumType.IMAGE
    data: File[]
}
type EmbedPollCreation = {
    type: EmbedEnumType.POLL
    data: {
        options: string[]
        multiple: boolean
        anonymous: boolean
    }
}
export type EmbedCreation = EmbedMediaCreation | EmbedGalleryCreation | EmbedPollCreation;
