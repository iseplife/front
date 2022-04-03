import React from "react"
import {useTranslation} from "react-i18next"
import {Link} from "react-router-dom"
import {useLiveQuery} from "dexie-react-hooks"
import {eventsManager} from "../../../datamanager/EventsManager"

type PostEventTagProps = {
    id: number
}
export const PostEventTag: React.FC<PostEventTagProps> = ({id}) => {
    const {t} = useTranslation("post")
    const event = useLiveQuery(async () => await eventsManager.getEventByEventFeedId(id), [id])

    return event ? (
        <Link to={`/event/${event.id}`} className="min-w-0">
            <div
                className="flex text-sm rounded px-2 py-0.5 font-medium hover:shadow-sm transition-shadow items items-center bg-red-300"
                title={t("post:posted_in_event", {event: event.title})}
            >
                <div className="bg-neutral-50 w-4 h-4 shadow-sm rounded-sm mr-1.5 overflow-hidden ">
                    <div className="bg-red-500 w-4 h-[0.32rem]"/>
                </div>
                <div className="text-white text-ellipsis whitespace-nowrap overflow-hidden">{event.title}</div>
            </div>
        </Link>
    ): null
}

export default PostEventTag