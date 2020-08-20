import {Club} from "../club/types"
import {Image} from "../media/types"

export type Gallery = {
    id: number
    name: string
    official: true
    club: Club,
    creation: Date,
    embedType: string,
    coverImage: Image
    previewImages: Image[]
}

export type GalleryForm = {
    name: string
    description: string
    images: number[]
    feed: number
    club?: Club
}

