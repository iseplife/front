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
    SET_TOKEN_EXPIRATION,
    SET_LAST_EXPLORE,
    SET_SELECTED_PUBLISHER,
    SET_PASSWORD_SETUP
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

interface setStudentAction {
    type: AppActionType.SET_STUDENT,
    payload: LoggedStudentPreview
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
interface setLastExploreAction {
    type: AppActionType.SET_LAST_EXPLORE,
    lastWatch: Date
}

interface setSelectedPublisherAction {
    type: AppActionType.SET_SELECTED_PUBLISHER,
    selectedPublisher?: Author
}

interface setPasswordSetupAction {
    type: AppActionType.SET_PASSWORD_SETUP,
    passwordSetup: boolean
}

export type AppContextAction =
    setInitializationAction |
    setStateLoggedOutAction |
    setPayloadAction |
    setFullStateAction |
    setPictureStateAction |
    setTokenExpirationAction |
    setTokenAction |
    setStudentAction |
    setLastExploreAction |
    setSelectedPublisherAction |
    setPasswordSetupAction


