import ClubType from "../../constants/ClubType"
import {Student} from "../student/types"

export enum ClubRole {
    MEMBER = "MEMBER",
    PUBLISHER = "PUBLISHER",
    ADMIN = "ADMIN",
    SUPER_ADMIN = "SUPER_ADMIN",
}

export type Club = {
    id: number
    logoUrl: string
    cover?: string
    name: string
    description: string
    type: ClubType
    creation: number
    archived: boolean
    feed: number

    canEdit: boolean
    facebook?: string
    instagram?: string
    snapchat?: string
    website?: string
}

export interface ClubPreview {
    id: number
    name: string
    description: string
    logoUrl: string
}

export type ClubMember = {
    id: number
    role: ClubRole
    position: string
    student: Student
    parent: number
}

export type ClubMemberPreview = {
    id: number
    position: string
    club: ClubPreview
}

export type ClubForm = {
    name: string
    description: string
    creation: Date
    type: ClubType
    admins: number[]
    logo?: File

    facebook?: string
    instagram?: string
    website?: string
}