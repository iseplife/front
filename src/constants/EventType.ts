enum EventType {
    "PARTY"= "PARTY",
    "AFTERWORK" = "AFTERWORK",
    "CONFERENCE" = "CONFERENCE",
    "WORKSHOP" = "WORKSHOP",
    "FORMATION" = "FORMATION",
    "MEETING" = "MEETING",
    "OTHER" = "OTHER",
}
export default EventType
export const EventTypes = [EventType.PARTY, EventType.AFTERWORK, EventType.CONFERENCE, EventType.WORKSHOP, EventType.FORMATION, EventType.MEETING, EventType.OTHER]
export const EventTypeColor: {[index: string]: string} = {
    [EventType.PARTY]: "#ed64a6",
    [EventType.AFTERWORK]: "#ed8936",
    [EventType.CONFERENCE]: "#a0aec0",
    [EventType.WORKSHOP]: "#4299e1",
    [EventType.FORMATION]: "#4299e1",
    [EventType.MEETING]: "#f56565",
    [EventType.OTHER]: "#fdce59",
}
export const EventTypeInvertColor: {[index: string]: string} = {
    [EventType.PARTY]: "#fff",
    [EventType.AFTERWORK]: "#fff",
    [EventType.CONFERENCE]: "#fff",
    [EventType.WORKSHOP]: "#fff",
    [EventType.FORMATION]: "#fff",
    [EventType.MEETING]: "#fff",
    [EventType.OTHER]: "#333",
}

export const EventTypeEmoji: {[index: string]: string} = {
    [EventType.PARTY]: "\uD83C\uDF89",
    [EventType.AFTERWORK]: "\uD83C\uDF7B",
    [EventType.CONFERENCE]: "\uD83C\uDF99",
    [EventType.WORKSHOP]: "\uD83D\uDCBB",
    [EventType.FORMATION]: "\uD83D\uDCDA",
    [EventType.MEETING]: "\uD83D\uDD14",
    [EventType.OTHER]: "⭐",
}