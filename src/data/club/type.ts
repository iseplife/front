import ClubType from "../../constants/ClubType";

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