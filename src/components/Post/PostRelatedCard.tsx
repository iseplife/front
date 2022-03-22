import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { EventPreview } from "../../data/event/types"
import { GroupPreview } from "../../data/group/types"
//@ts-ignore
import { getPastelColor } from "pastel-color"

interface PostRelatedCardProps {
    event?: EventPreview,
    group?: GroupPreview,
}

export const PostRelatedCard: React.FC<PostRelatedCardProps> = ({event, group}) => {
    const {t} = useTranslation("post")
    return <>
        {event && <Link to={`/event/${event.id}`} className="min-w-0">
            <div className="flex text-sm rounded px-2 py-0.5 font-medium hover:shadow-sm transition-shadow items items-center bg-red-300" title={t("post:posted_in_event", { event: event.title })}>
                <div className="bg-neutral-50 w-4 h-4 shadow-sm rounded-sm mr-1.5 overflow-hidden "><div className="bg-red-500 w-4 h-[0.32rem]" /></div>
                <div className="text-white text-ellipsis whitespace-nowrap overflow-hidden">{event.title}</div>
            </div>
        </Link>}
        {group && <Link to={`/group/${group.id}`} className="min-w-0">
            <div className="flex text-sm rounded px-2 py-0.5 font-medium hover:shadow-sm transition-shadow" title={t("post:posted_in_group", { group: group.name })} style={{backgroundColor: getPastelColor(group.name).hex}}>
                <div className="text-white text-ellipsis whitespace-nowrap overflow-hidden">{group.name}</div>
            </div>
        </Link>}
    </>
}