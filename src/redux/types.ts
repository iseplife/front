import {Student} from "../data/student/types"
import {TokenPayload} from "../data/security/types"

const SET_STUDENT= "SET_STUDENT"
const SET_PAYLOAD= "SET_PAYLOAD"
const SET_STATE= "SET_STATE"
interface setStudentAction {
    type: typeof SET_STUDENT,
    user: Student
}
interface setPayloadAction {
    type: typeof SET_PAYLOAD,
    payload: TokenPayload
}
interface setFullStateAction {
    type: typeof SET_STATE,
    state: {
        payload: TokenPayload,
        user: Student
    }
}


export type AppState =  {
    user: Student
    payload: TokenPayload
}

export type AppAction = setStudentAction | setPayloadAction | setFullStateAction;


