import {LoggedStudentPreview, StudentPicture} from "../../data/student/types"
import {TokenPayload} from "../../data/security/types"
import {AppContextState} from "./context"
import {Author} from "../../data/request.type"

export enum AppActionType {
    SET_INITIALIZATION,
    SET_LOGGED_OUT,
    SET_STUDENT,
    SET_TOKEN,
    SET_PAYLOAD,
    SET_STATE,
    SET_PICTURE,
    SET_TOKEN_EXPIRATION
}


interface setInitializationAction {
    type: AppActionType.SET_INITIALIZATION,
    payload: {
        user: LoggedStudentPreview
        authors: Author[]
    }
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
    setInitializationAction |
    setStateLoggedOutAction |
    setPayloadAction |
    setFullStateAction |
    setPictureStateAction |
    setTokenExpirationAction |
    setTokenAction


