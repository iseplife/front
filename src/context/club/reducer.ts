import {ClubContextState} from "./context"
import {ClubActionType, ClubContextAction} from "./action"
import {ClubMember} from "../../data/club/types"


export const clubContextReducer = (state: ClubContextState, action: ClubContextAction): ClubContextState => {
    switch (action.type) {
        case ClubActionType.TOGGLE_ADMIN_MODE:
            return {
                ...state,
                adminMode: !state.adminMode
            }
        case ClubActionType.FETCH_CLUB:
            return {
                ...state,
                club: {
                    loading: true
                },
            }
        case ClubActionType.GET_CLUB:
        case ClubActionType.UPDATE_CLUB:
            return {
                ...state,
                club: {
                    loading: false,
                    data: action.payload
                },
            }
        case ClubActionType.FETCH_MEMBERS:
            return {
                ...state,
                members: {
                    loading: true,
                    data: []
                },
            }
        case ClubActionType.GET_MEMBERS:
            return {
                ...state,
                members: {
                    loading: false,
                    data: action.payload
                },
            }
        case ClubActionType.ADD_MEMBER:
            return {
                ...state,
                members: {
                    loading: false,
                    data: [...state.members.data, action.payload]
                },
            }
        case ClubActionType.UPDATE_MEMBER:
            return {
                ...state,
                members: {
                    loading: false,
                    data: state.members.data.map(cm => cm.id === action.payload.id ?
                        action.payload:
                        cm
                    )
                },
            }
        case ClubActionType.REMOVE_MEMBER:
            return {
                ...state,
                members: {
                    loading: false,
                    data: state.members.data.filter(cm => cm.id !== action.payload)
                },
            }

    }
    return state
}