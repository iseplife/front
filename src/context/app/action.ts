import {Student, StudentPicture, StudentPreview} from "../../data/student/types"
import {TokenPayload} from "../../data/security/types"
import {AppContextState} from "./context"

export enum AppActionType {
    SET_LOGGED_USER,
    SET_STUDENT,
    SET_PAYLOAD,
    SET_STATE,
    SET_PICTURE,
    SET_REFRESHING,
}


interface setLoggedStudentAction {
    type: AppActionType.SET_LOGGED_USER,
    payload: {
        user: StudentPreview,
        payload: TokenPayload
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

interface setRefreshingAction {
    type: AppActionType.SET_REFRESHING,
    refreshing: boolean
}

export type AppContextAction = setLoggedStudentAction | setPayloadAction | setFullStateAction | setPictureStateAction | setRefreshingAction


