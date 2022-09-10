import { useEffect, useMemo, useState } from "react"
import { useParams } from "react-router"
import { getEvent } from "../../../../data/event"
import { positionToMarker } from "../../../../util"
import ErrorInterface from "../../../errors/ErrorInterface"
import LoadingPage from "../../../LoadingPage"
import AddEventPage from "../add"

const dateToFormat = (date: Date) => new Date(Math.floor((date.getTime()-date.getTimezoneOffset()*60*1000) / 1000 / 60) * 1000 * 60).toISOString().replace("Z", "")

const EventEditPage: React.FC = () => {
    const {id: idStr} = useParams<{id: string}>()
    const id = useMemo(() => parseInt(idStr || ""), [idStr])
    const [event, setEvent] = useState<{[key: string]: any}>()
    const [error, setError] = useState(false)
    useEffect(() => {
        if(id)
            getEvent(id).then(({data: event}) => {
                setEvent({
                    type: event.type,
                    title: event.title,
                    description: event.description,
                    closed: event.closed,
                    startsAt: dateToFormat(event.startsAt),
                    endsAt: dateToFormat(event.endsAt),
                    club: event.club.id,
                    published: event.published,
                    targets: event.targets,
                    location: event.location,
                    price: event.price,
                    ticketURL: event.ticketURL,
                    coordinates: positionToMarker(event.position)
                })
            }).catch(() => setError(true))
    }, [id])

    return error ? <ErrorInterface error="error:error_fetch_event" /> : event ? <AddEventPage defaultValues={event} eventId={id} /> : <LoadingPage message="event:loading" />
}

export default EventEditPage