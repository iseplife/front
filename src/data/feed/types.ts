export enum FeedType {
    "CLUB"= "CLUB",
    "EVENT" = "EVENT",
    "GROUP" = "GROUP",
    "STUDENT" = "STUDENT"
}

export type Feed = {
    id: number
    name: string
    type: FeedType
}

export type FeedContext = Omit<Feed, "name">


export type Subscription = {
    extensive: boolean
} | undefined