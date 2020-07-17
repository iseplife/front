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
