import ClubType from "../../constants/ClubType";
import {Student} from "../student/types";
import RoleType from "../../constants/RoleType";

export type Club = {
    id: number,
    name: string,
    type: ClubType,
    description: string,
    logoUrl: string,
    createdAt: number,
    archivedAt?: number,
}

export type ClubPreview = {
    id: number,
    name: string,
    logoUrl: string,
}

export type ClubMemberView = {
    club: Club,
    role: RoleType,
    member: Student
}