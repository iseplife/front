export type SearchItem = {
    id: number,
    type: Exclude<SearchItemType, SearchItemType.ALL>,
    name: string,
    thumbURL: string,
    description: string,
    status: boolean,
    startsAt?: Date
}

export enum SearchItemType {
    STUDENT = "STUDENT",
    EVENT = "EVENT",
    CLUB = "CLUB",
    GROUP = "GROUP",
    ALL = "ALL"
}

export const SearchTypeSet = [SearchItemType.STUDENT, SearchItemType.EVENT, SearchItemType.CLUB, SearchItemType.GROUP]