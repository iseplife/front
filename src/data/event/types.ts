export interface EventPreview {
    id: number
    name: string
    startsAt: number,
    endsAt: number,
    location: string,
    imageUrl?: string
}

export interface EventList {
    [date: number]: EventPreview[]
}