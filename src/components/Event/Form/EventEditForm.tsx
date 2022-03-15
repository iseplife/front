import {withFormik} from "formik"
import {EventForm as EventFormType, Event as EventType, Marker} from "../../../data/event/types"
import {editEvent} from "../../../data/event"
import {message} from "antd"
import EventForm from "./EventForm"
import {positionToMarker} from "../../../util"


type EventEditFormProps = {
    previousEdition?: number
    event: EventType
    message: string
    onSubmit?: (e: EventType) => void
    onClose: () => void
}
const EventEditForm = withFormik<EventEditFormProps, EventFormType>({
    mapPropsToValues: ({event}) => {
        let coordinates: Marker | undefined = undefined
        if (event.position) {
            const strArr = event.position.coordinates.split(";")
            coordinates = [+strArr[0], +strArr[1]]
        }

        return ({
            type: event.type,
            title: event.title,
            description: event.description,
            closed: event.closed,
            startsAt: event.startsAt,
            endsAt: event.endsAt,
            club: event.club.id,
            published: event.published,
            targets: event.targets.map(t => t.id),
            coordinates: positionToMarker(event.position)
        })
    },
    handleSubmit: async (values, {props}) => {
        editEvent(values).then(res => {
            if (res.status === 200) {
                props.onSubmit && props.onSubmit(res.data)
                message.info(props.message)
                props.onClose()
            }
        })
    },
    displayName: "EventEditForm",
})(EventForm)
export default EventEditForm
