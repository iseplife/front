export enum MediaStatus {
    UNPROCESSED = "UNPROCESSED",
    PROCESSING = "PROCESSING",
    READY = "READY"
}

export type MediaUploadNSFW = {
    file: File
    nsfw: boolean
}

export type MediaEditionNSFW = {
    id: number
    file: string
    nsfw: boolean
}

export interface MediaName {
    name: string
}

export interface Media extends MediaName {
    id: number
    creation: Date
    nsfw: boolean
    status: MediaStatus
}


export type Image = Media & {
    thread: number
    color: string
    ratio: number
}

export type Video = Media & {
    title: string
    thumbnail: string
    views: number
    ratio: number
}


export type DocumentCreation = {
    file: File
    nsfw: boolean
}

export type DocumentEdition = {
    id: number
    title: string
    file: string
    nsfw: boolean
}

export type Document = Media & {
    title: string
    sizeBytes: number
}
