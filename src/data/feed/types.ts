export enum FeedType {
    "CLUB"= "CLUB",
    "EVENT" = "EVENT",
    "GROUP" = "GROUP",
    "STUDENT" = "STUDENT"
}

export type Feed = {
    id: number
    feedId: number
    name: string
    type: FeedType
}

export type FeedContext = Feed


export type Subscription = {
    extensive: boolean
} | undefined