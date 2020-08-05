export type SearchItem = {
    id: number,
    type: SearchItemType,
    name: string,
    thumbURL: string,
    description: string,
    status: boolean
}

export enum SearchItemType {
    STUDENT = "STUDENT",
    EVENT = "EVENT",
    CLUB = "CLUB",
    ALL = "ALL"
}