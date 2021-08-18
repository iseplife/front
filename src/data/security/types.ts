export interface TokenSet {
    token: string
    refreshToken: string
}

export type ParsedToken = {
    payload: TokenPayload
    iss: string
    exp: number
    iat: number
}

export type Token = {
    payload: string
    iss: string
    exp: number
    iat: number
}

export interface TokenPayload {
    id: number
    roles: Roles[]
    feeds: Array<number>
    clubsAdmin: Array<number>
    clubsPublisher: Array<number>
    lastConnection?: Date
}

export type Role = {
    id: number
    role: string
    authority: string
}

export enum Roles {
    ADMIN = "ROLE_ADMIN",
    STUDENT= "ROLE_STUDENT",
    LEAD_BDE = "ROLE_BDE"
}
