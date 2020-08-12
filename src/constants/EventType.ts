enum EventType {
    "PARTY"= "PARTY",
    "AFTERWORK" = "AFTERWORK",
    "CONFERENCE" = "CONFERENCE",
    "WORKSHOP" = "WORKSHOP",
    "FORMATION" = "FORMATION",
    "MEETING" = "MEETING",
}
export default EventType
export const EventTypes = [EventType.PARTY, EventType.AFTERWORK, EventType.CONFERENCE, EventType.WORKSHOP, EventType.FORMATION, EventType.MEETING]
export const EventTypeColor: {[index: string]: string} = {
    [EventType.PARTY]: "#ed64a6",
    [EventType.AFTERWORK]: "#ed8936",
    [EventType.CONFERENCE]: "#a0aec0",
    [EventType.WORKSHOP]: "#4299e1",
    [EventType.FORMATION]: "#4299e1",
    [EventType.PARTY]: "#f56565",
}


