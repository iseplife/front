import {ClubPreview} from "../club/types"
import {Image} from "../media/types"

export type Gallery = {
    id: number
    creation: Date
    name: string
    club: ClubPreview
    images: Image[]
    hasRight: boolean
}

export type GalleryPreview = {
    id: number
    name: string
    preview: Image[]
}

export type GalleryForm = {
    name: string
    description: string
    images: number[]
    feed: number
    pseudo: boolean
    club: number
}

