import ClubType from "../../constants/ClubType";
import {Student} from "../student/types";
import RoleType from "../../constants/RoleType";

export type Club = {
    id: number
    name: string
    description: string
    archivedAt?: number
    createdAt: number
    feed?: bigint
    type: ClubType
    facebook?: string
    facebook_token?: string
    snapchat?: string
    instagram?: string
    website?: string
    isAdmin: boolean
    members?: any
    events?: any
    posts?: any
    logoUrl: string
}

export type ClubPreview = {
    id: number
    name: string
    logoUrl: string
}

export type ClubMemberView = {
    club: Club
    role: RoleType
    member: Student
}