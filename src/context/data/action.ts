import EventsManager from "../../datamanager/EventsManager"
import FeedsManager from "../../datamanager/FeedsManager"
import GroupsManager from "../../datamanager/GroupsManager"

export enum DataActionType {
    UPDATE_GROUPS,
    UPDATE_FEEDS,
    UPDATE_EVENTS,
}


interface UpdateGroupsAction {
    type: DataActionType.UPDATE_GROUPS,
    payload: GroupsManager
}

interface UpdateFeedsAction {
    type: DataActionType.UPDATE_FEEDS,
    payload: FeedsManager
}

interface UpdateEventsAction {
    type: DataActionType.UPDATE_EVENTS,
    payload: EventsManager
}

export type DataContextAction = UpdateGroupsAction
    | UpdateFeedsAction
    | UpdateEventsAction