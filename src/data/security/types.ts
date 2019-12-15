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
    roles: Array<string>,
    clubsAdmin: Array<number>,
    clubsPublisher: Array<number>,
}