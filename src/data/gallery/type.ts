import {Club} from "../club/type";

export type Gallery = {
    id: number
    name: string
    official: true
    club: Club,
    creation: Date,
    embedType: string,
    coverImage: Media
    previewImages: Media[]
}

export type Media = {
    id: number
    creation: Date
    name: string
    embedType: string
    nsfw: string
}

