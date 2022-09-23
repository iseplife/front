import { StudentPreview } from "../../../student/types"

export interface WeiMapEntity {
    id: number
    name: string
    description: string
    assetUrl: string
    lat: number
    lng: number
    size: number
}
export interface WeiMapFriend {
    lat: number
    lng: number
    timestamp: Date

    student: StudentPreview
}