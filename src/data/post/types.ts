import {Club} from "../club/types";
import {Author} from "../request.type";
import EmbedType from "../../constants/EmbedType";
import { GalleryPreForm} from "../gallery/types";

export type PostCreation = {
    description: string
    private: boolean
    draft: boolean
    feed: number
    linkedClub?: number
    attachements: Map<EmbedType, number>
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



type EmbedGallery = {
    type: EmbedType.GALLERY
    data: GalleryPreForm
}
type EmbedMedia = {
    type: EmbedType.DOCUMENT | EmbedType.VIDEO | EmbedType.IMAGE
    data: File[]
}
type EmbedPoll = {
    type: EmbedType.POLL
    data: {
        options: string[]
        multiple: boolean
        anonymous: boolean
    }
}
export type EmbedCreation = EmbedMedia | EmbedGallery | EmbedPoll;
