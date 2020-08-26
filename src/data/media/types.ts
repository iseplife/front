enum EmbedType {
    GALLERY = "gallery",
    POLL = "poll",
    DOCUMENT = "document",
    VIDEO = "video",
    IMAGE = "image",
}

export interface Media {
    id: number
    creation: Date
    name: string
    NSFW: boolean
    embedType: EmbedType
}

export type Image = Media & {
    thread: number
    embedType: EmbedType.IMAGE
}

export type Video = Media & {
    title: string
    thumbnail: string
    views: number
    embedType: EmbedType.VIDEO
}

export type Document = Media & {
    title: string
    embedType: EmbedType.DOCUMENT
}