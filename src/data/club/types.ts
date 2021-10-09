import ClubType from "../../constants/ClubType"
import { StudentPreview} from "../student/types"
import {IconDefinition} from "@fortawesome/fontawesome-svg-core"
import {faPenNib, faUser, faUserShield} from "@fortawesome/free-solid-svg-icons"

export enum ClubRole {
    MEMBER = "MEMBER",
    PUBLISHER = "PUBLISHER",
    ADMIN = "ADMIN",
}
export const ClubRoles = [ClubRole.MEMBER, ClubRole.PUBLISHER, ClubRole.ADMIN]
export const ClubRoleIcon: { [role: string]: IconDefinition } = {
    [ClubRole.ADMIN]: faUserShield,
    [ClubRole.PUBLISHER]: faPenNib,
    [ClubRole.MEMBER]: faUser,
}

export type Club = {
    id: number
    logoUrl: string
    coverUrl?: string
    name: string
    description: string
    type: ClubType
    creation: number
    archived: boolean
    feed: number

    canEdit: boolean
    subscribed: boolean
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
    student: StudentPreview
    parent: number
}

export type ClubMemberPreview = {
    id: number
    position: string
    club: ClubPreview
}

export type ClubMemberForm = {
    role: ClubRole
    position: string
}

export type ClubForm = {
    name: string
    description: string

    facebook?: string
    instagram?: string
    website?: string
}

export type ClubAdminForm = ClubForm & {
    creation: Date
    type: ClubType
    admins: number[]
    logo?: File
}
