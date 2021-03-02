import React, {useState} from "react"
import {Button, Modal} from "antd"
import {useTranslation} from "react-i18next"
import EventCreateForm from "./form/EventCreateForm"

type EventModalFormProps = {
    onSubmit: () => void
    className?: string
}
const EventCreatorModal: React.FC<EventModalFormProps> = ({onSubmit, className = ""}) => {
    const {t} = useTranslation("event")
    const [open, setOpen] = useState<boolean>(false)
    return (
        <>
            <Button
                className={`shadow-md rounded-full px-3 h-auto bg-indigo-200 text-indigo-400 text-md font-bold ${className}`}
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