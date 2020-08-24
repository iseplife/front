export type Page<T> = {
    content: T[]
    first: boolean
    last: boolean
    number: number
    size: number
    totalPages: number
    totalElements: number
};

export type Author = {
    id: number
    type: "CLUB" | "STUDENT" | "ADMIN"
    name: string
    thumbnail: string
}

export interface Entity {
    id: number
}

export type LazyLoad<T> = {
    loading: boolean
    data?: T
}

export enum UploadState {
    OFF,
    UPLOADING = "active",
    ERROR = "exception",
    FINISHED = "success"
}