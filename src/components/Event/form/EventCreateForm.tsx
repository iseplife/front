import {withFormik} from "formik"
import {EventForm as EventFormType} from "../../../data/event/types"
import {createEvent} from "../../../data/event"
import {message} from "antd"
import EventForm from "./EventForm"
import EventType from "../../../constants/EventType";


const DEFAULT_EVENT: EventFormType = {
    type: EventType.AFTERWORK,
    title: "",
    description: "",
    closed: false,
    start: new Date(),
    end: new Date(),
    club: -1,
    published: new Date(),
    targets: [],
}

type EventCreateFormProps = {
    previousEdition?: number
    event?: EventFormType
    message: string
    onSubmit?: () => void
    onClose: () => void
}
const EventCreateForm = withFormik<EventCreateFormProps, EventFormType>({
    mapPropsToValues: () => DEFAULT_EVENT,
    handleSubmit: async (values, {props}) => {
        createEvent(values).then(res => {
            if (res.status === 200) {
                props.onSubmit &&  props.onSubmit()
                message.info(props.message)
                props.onClose()
            }
        })
    },
    displayName: "EventCreateForm",
})(EventForm)
export default EventCreateForm