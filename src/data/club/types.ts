import ClubType from "../../constants/ClubType";
import {Student} from "../student/types";
import RoleType from "../../constants/RoleType";

export type Club = {
    id: number
    logoUrl: string
    name: string
    description: string
    type: ClubType
    creation: number
    archived: boolean
    feed: number

    facebook?: string
    instagram?: string
    website?: string
}

export interface ClubPreview {
    id: number
    name: string
    description: string
    logoUrl: string
}

export type ClubMemberView = {
    club: Club
    role: RoleType
    member: Student
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