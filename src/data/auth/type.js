// @flow

export type TokenSet = {
  token: string,
  refreshToken: string,
};

export type Token = {
  payload: string,
  iss: string,
  exp: number,
  iat: number,
};

export type RefreshToken = {
  userID: number,
  iss: string,
  exp: number,
  iat: number,
};

export type TokenPayload = {
  id: number,
  roles: Array<string>,
  clubsAdmin: Array<number>,
};
