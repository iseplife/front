import {StudentPicture, StudentPreview} from "../../data/student/types"
import {ParsedToken, TokenPayload} from "../../data/security/types"
import {AppContextState} from "./context"

export enum AppActionType {
    SET_LOGGED_USER,
    SET_STUDENT,
    SET_TOKEN,
    SET_PAYLOAD,
    SET_STATE,
    SET_PICTURE,
    SET_TOKEN_EXPIRATION,
}


interface setLoggedStudentAction {
    type: AppActionType.SET_LOGGED_USER,
    user: StudentPreview
}

interface setPayloadAction {
    type: AppActionType.SET_PAYLOAD,
    payload: TokenPayload
}

interface setPictureStateAction {
    type: AppActionType.SET_PICTURE,
    payload: StudentPicture
}

interface setFullStateAction {
    type: AppActionType.SET_STATE,
    state: AppContextState
}

interface setTokenExpirationAction {
    type: AppActionType.SET_TOKEN_EXPIRATION,
    token_expiration: number
}

interface setTokenAction {
    type: AppActionType.SET_TOKEN,
    token: string
}

export type AppContextAction = setLoggedStudentAction | setPayloadAction | setFullStateAction | setPictureStateAction | setTokenExpirationAction | setTokenAction


