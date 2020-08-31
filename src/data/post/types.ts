import {Club} from "../club/types"
import {Author} from "../request.type"
import EmbedEnumType from "../../constants/EmbedEnumType"
import {Gallery, GalleryPreForm} from "../gallery/types"
import {Image, Video, Document} from "../media/types"
import {Poll} from "../poll/types"

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


export type Embed = Gallery | Image | Poll | Video | Document;



type EmbedGallery = {
    type: EmbedEnumType.GALLERY
    data: GalleryPreForm
}
type EmbedMedia = {
    type: EmbedEnumType.DOCUMENT | EmbedEnumType.VIDEO | EmbedEnumType.IMAGE
    data: File[]
}
type EmbedPoll = {
    type: EmbedEnumType.POLL
    data: {
        options: string[]
        multiple: boolean
        anonymous: boolean
    }
}
export type EmbedCreation = EmbedMedia | EmbedGallery | EmbedPoll;
