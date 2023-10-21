import {ClubPreview} from "../club/types"
import {Image} from "../media/types"

export type Gallery = {
    id: number
    creation: Date
    name: string
    club: ClubPreview
    images: Image[]
    hasRight: boolean
    description: string
}

export type GalleryPreview = {
    id: number
    name: string
    preview: Image[]
}

type PseudoGalleryForm = {
    images: number[]
    feed: number
    pseudo: true
}

export type OfficialGalleryForm = {
    name: string
    description: string
    images: number[]
    feed: number
    pseudo: false
    generatePost: boolean
    club: number
}

export type GalleryForm = PseudoGalleryForm | OfficialGalleryForm

export type GalleryPreForm = {
    name?: string
    club?: number
    feed: number
    pseudo: boolean
    images: File[]
}

export type GalleryUpdateForm = {
    name: string
    description: string
}