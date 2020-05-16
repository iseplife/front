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

export type SearchItem = {
    id: number
    type: "EVENT" | "CLUB" | "STUDENT"
    name: string
    description: string
    thumbURL?: string
    status: boolean
}