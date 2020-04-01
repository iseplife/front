export interface TokenSet {
    token: string,
    refreshToken: string,
}

export interface Token {
    payload: string,
    iss: string,
    exp: number,
    iat: number,
}

export interface RefreshToken {
    userID: number,
    iss: string,
    exp: number,
    iat: number,
}

export interface TokenPayload {
    id: number,
    roles: Roles[],
    clubsAdmin: Array<number>,
    clubsPublisher: Array<number>,
    feed: Array<string>
}

export enum Roles {
    ADMIN = "ROLE_ADMIN",
    STUDENT= "ROLE_STUDENT",
    LEAD_BDE = "ROLE_BDE"
}