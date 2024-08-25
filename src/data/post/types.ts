import {Author} from "../request.type"
import {GalleryPreForm} from "../gallery/types"
import {
    Image,
    Video,
    Document,
    MediaUploadNSFW,
    MediaEditionNSFW,
    DocumentCreation,
    DocumentEdition,
    RichLink
} from "../media/types"
import {Poll, PollForm} from "../poll/types"
import { Comment } from "../thread/types"
import {FeedContext} from "../feed/types"


export enum EmbedEnumType {
    GALLERY = "gallery",
    POLL = "poll",
    DOCUMENT = "document",
    VIDEO = "video",
    IMAGE = "image",
    RICH_LINK = "rich_link",
}

export type BasicPostCreation = {
    description: string
    feed?: number
}


export type PostCreation = BasicPostCreation & {
    linkedClub?: number
    publicationDate?: Date
    attachements:  { [type: string]: number }
}

export type PostUpdateForm = {
    description: string
    publicationDate: Date
    linkedClub?: number
    removeEmbed?: boolean
    attachements?:  { [type: string]: number }
}


export type Post = {
    id: number
    context: FeedContext
    description: string
    publicationDate: Date
    creationDate: Date
    pinned: boolean
    homepagePinned: boolean
    homepageForced: boolean
    author: Author
    embed?: Embed
    thread: number
    trendingComment?: Comment
    nbComments: number
    nbLikes: number
    oldLikes: number
    liked: boolean
    hasWriteAccess: boolean
}

export type PostUpdate = {
    id: number
    feedId: number
    author: Author
    description: string
    publicationDate: Date
    thread: number
    embed?: Embed
    pinned: boolean
}


export type EmbedPoll = Poll & {
    embedType: EmbedEnumType.POLL
}

export type EmbedRichLink = RichLink & {
    embedType: EmbedEnumType.RICH_LINK
}

export type EmbedGallery = {
    id: number
    name: string
    preview: Array<Image>
    pseudo: boolean
    embedType: EmbedEnumType.GALLERY
}
export type EmbedPseudoGallery = {
    id: number
    images: Array<Image>
    embedType: EmbedEnumType.IMAGE
}

export type EmbedMedia = Video & {embedType: EmbedEnumType.VIDEO}
    | Document  & {embedType: EmbedEnumType.DOCUMENT}

export type Embed = EmbedGallery | EmbedPseudoGallery | EmbedMedia | EmbedPoll | EmbedRichLink

export type EmbedGalleryCreation = {
    type: EmbedEnumType.GALLERY
    data: GalleryPreForm
}
export type EmbedMediaCreation = {
    type: EmbedEnumType.VIDEO | EmbedEnumType.IMAGE
    data: Array<MediaUploadNSFW>
}

export type EmbedMediaEdition = {
    type: EmbedEnumType.VIDEO | EmbedEnumType.IMAGE
    data:  Array<MediaEditionNSFW | MediaUploadNSFW>
}

export type EmbedDocumentCreation = {
    type: EmbedEnumType.DOCUMENT
    data: DocumentCreation
}
export type EmbedDocumentEdition = {
    type: EmbedEnumType.DOCUMENT
    data: DocumentCreation | DocumentEdition
}


export type EmbedPollForm = {
    type: EmbedEnumType.POLL
    data: PollForm
}
export type EmbedCreation = EmbedMediaCreation | EmbedGalleryCreation | EmbedPollForm |  EmbedDocumentCreation

export type EmbedGalleryEdition = {
    type: EmbedEnumType.GALLERY
    data: GalleryPreForm
}


export type EmbedEdition = EmbedMediaEdition | EmbedGalleryEdition | EmbedPollForm | EmbedDocumentEdition

export interface EmbedForm {
    type: EmbedEnumType,
    data: any
}

export const ACCEPTED_FILETYPE: Record<EmbedEnumType, string> = {
    [EmbedEnumType.IMAGE]: ".png,.jpg,.jpeg,.gif",
    [EmbedEnumType.VIDEO]: ".mp4,.webm",
    [EmbedEnumType.DOCUMENT]: "*",
    [EmbedEnumType.GALLERY]: "*",
    [EmbedEnumType.POLL]: "*",
    [EmbedEnumType.RICH_LINK]: "*"
}

export const DEFAULT_EMBED: Record<EmbedEnumType, EmbedCreation> = {
    [EmbedEnumType.GALLERY]: {
        type: EmbedEnumType.GALLERY,
        data: {
            name: "",
            feed: 1,
            pseudo: false,
            images: []
        }
    },
    [EmbedEnumType.DOCUMENT]: {
        type: EmbedEnumType.DOCUMENT,
        data: {
            nsfw: false
        } as DocumentCreation
    },
    [EmbedEnumType.POLL]: {
        type: EmbedEnumType.POLL,
        data: {
            title: "",
            choices: [{content: ""}, {content: ""}],
            multiple: false,
            anonymous: true,
            endsAt: new Date(Date.now() + (6.048e+8)) // One week from now
        }
    },
    [EmbedEnumType.IMAGE]: {
        type: EmbedEnumType.IMAGE,
        data: []
    },
    [EmbedEnumType.VIDEO]: {
        type: EmbedEnumType.VIDEO,
        data: []
    },
    [EmbedEnumType.RICH_LINK]: undefined!,
}
