export type Page<T> = {
    content: T[]
    first: boolean
    last: boolean
    number: number
    size: number
    totalPages: number
    totalElements: number
}

export type Author = {
    id: number
    feedId: number
    type: "CLUB" | "STUDENT" | "ADMIN"
    name: string
    thumbnail: string
}

export interface Entity {
    id: number
}

export type LazyLoad<T> =
    { loading: true, data: undefined } |
    { loading: false, data: T }

export enum UploadState {
    OFF,
    UPLOADING = "active",
    ERROR = "exception",
    FINISHED = "success"
}

export type LocationState = {
    from: {
        pathname: string
    }
}
