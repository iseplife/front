import {Student, StudentPicture, StudentPreview} from "../data/student/types"
import {TokenPayload} from "../data/security/types"
import {Feed} from "../data/feed/types"

const SET_STUDENT= "SET_STUDENT"
const SET_PAYLOAD= "SET_PAYLOAD"
const SET_STATE= "SET_STATE"
const SET_PICTURE= "SET_PICTURE"

interface setStudentAction {
    type: typeof SET_STUDENT,
    user: Student
}
interface setPayloadAction {
    type: typeof SET_PAYLOAD,
    payload: TokenPayload
}
interface setPictureStateAction {
    type: typeof SET_PICTURE,
    payload: StudentPicture
}
interface setFullStateAction {
    type: typeof SET_STATE,
    state: AppState
}

export type AppState =  {
    user: StudentPreview
    payload: TokenPayload
    feeds: Record<number, Feed>
}

export type AppAction = setStudentAction | setPayloadAction | setFullStateAction | setPictureStateAction;


