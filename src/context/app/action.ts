import {LoggedStudentPreview, StudentPicture} from "../../data/student/types"
import {TokenPayload} from "../../data/security/types"
import {AppContextState} from "./context"

export enum AppActionType {
    SET_LOGGED_USER,
    SET_LOGGED_OUT,
    SET_STUDENT,
    SET_TOKEN,
    SET_PAYLOAD,
    SET_STATE,
    SET_PICTURE,
    SET_TOKEN_EXPIRATION,
}


interface setLoggedStudentAction {
    type: AppActionType.SET_LOGGED_USER,
    user: LoggedStudentPreview
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

interface setStateLoggedOutAction {
    type: AppActionType.SET_LOGGED_OUT,
}

export type AppContextAction =
    setLoggedStudentAction |
    setStateLoggedOutAction |
    setPayloadAction |
    setFullStateAction |
    setPictureStateAction |
    setTokenExpirationAction |
    setTokenAction


