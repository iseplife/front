import {withFormik} from "formik"
import {EventForm as EventFormType, Event as EventType} from "../../../data/event/types"
import {editEvent} from "../../../data/event"
import {message} from "antd"
import EventForm from "./EventForm"


type EventEditFormProps = {
    previousEdition?: number
    event: EventFormType
    message: string
    onSubmit?: (e: EventType) => void
    onClose: () => void
}
const EventEditForm = withFormik<EventEditFormProps, EventFormType>({
    mapPropsToValues: ({event}) => event,
    handleSubmit: async (values, {props}) => {
        editEvent(values).then(res => {
            if (res.status === 200) {
                props.onSubmit &&  props.onSubmit(res.data)
                message.info(props.message)
                props.onClose()
            }
        })
    },
    displayName: "EventEditForm",
})(EventForm)
export default EventEditForm
