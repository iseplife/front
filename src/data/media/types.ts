import {EmbedEnumType} from "../post/types"

export interface Media {
    id: number
    creation: Date
    name: string
    nsfw: boolean
}

export type Image = Media & {
    thread: number
    embedType: EmbedEnumType.IMAGE
}

export type Video = Media & {
    title: string
    thumbnail: string
    views: number
    embedType: EmbedEnumType.VIDEO
}

export type Document = Media & {
    title: string
    embedType: EmbedEnumType.DOCUMENT
}