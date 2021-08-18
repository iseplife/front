export type MediaUploadNSFW = {
    file: File
    nsfw: boolean
}

export type MediaEditionNSFW = {
    id: number
    file: string
    nsfw: boolean
}


export interface Media {
    id: number
    creation: Date
    name: string
    nsfw: boolean
}

export type Image = Media & {
    thread: number
}

export type Video = Media & {
    title: string
    thumbnail: string
    views: number
}

export type Document = Media & {
    title: string
}
