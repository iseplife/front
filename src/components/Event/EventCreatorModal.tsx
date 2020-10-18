import React, {useState} from "react"
import EventForm from "./form/EventForm"
import {Button, Modal} from "antd"
import {useTranslation} from "react-i18next"
import EventCreateForm from "./form/EventCreateForm";

type EventModalFormProps = {
    onSubmit: () => void
}
const EventCreatorModal: React.FC<EventModalFormProps> = ({onSubmit}) => {
    const {t} = useTranslation("event")
    const [open, setOpen] = useState<boolean>(false)
    return (
        <>
            <Button
                className="rounded px-2 self-center md:self-end bg-transparent text-gray-600"
                style={{width: "max-content"}}
                onClick={() => setOpen(true)}
            >
                {t("create.button")} +
            </Button>
            {open &&
            <Modal
                className="md:w-1/2 w-4/5"
                visible={true}
                footer={null}
                title={<span className="text-gray-800 font-bold text-2xl">{t("create.title")}</span>}
                onCancel={() => setOpen(false)}
            >
                <EventCreateForm onSubmit={onSubmit} onClose={() => setOpen(false)} message={t("create.created")}/>
            </Modal>
            }
        </>
    )
}
export default EventCreatorModal