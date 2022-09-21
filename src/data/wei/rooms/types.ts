import { StudentPreview } from "../../student/types"

export interface WeiAvailableRoom {
    capacity: number
    count: number
}

export interface WeiRoom {
    id: number
    capacity: number
    reservedUpTo: Date
    booked: boolean
    members: WeiRoomMember[]
}

export interface WeiRoomMember {
    student: StudentPreview
    admin: boolean
    joined: Date
}