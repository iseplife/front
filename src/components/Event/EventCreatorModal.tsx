import React, {useState} from "react"
import {Modal} from "antd"
import {useTranslation} from "react-i18next"
import EventCreateForm from "./Form/EventCreateForm"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faPlus} from "@fortawesome/free-solid-svg-icons"

type EventModalFormProps = {
    onSubmit?: () => void
    className?: string
}
const EventCreatorModal: React.FC<EventModalFormProps> = ({onSubmit}) => {
    const {t} = useTranslation("event")
    const [open, setOpen] = useState<boolean>(false)
    return (
        <>
            <div className="flex justify-center">
                <button
                    onClick={() => setOpen(true)}
                    className="
                        flex items-center mx-auto rounded-full bg-indigo-400 text-base
                        text-white cursor-pointer opacity-100 hover:opacity-80 duration-200 p-2
                    "
                >
                    <FontAwesomeIcon icon={faPlus} className="w-4 h-4 block flex-shrink-0"/>
                </button>
            </div>
            {open && (
                <Modal
                    className="md:w-1/2 w-4/5"
                    visible={true}
                    footer={null}
                    title={<span className="text-gray-800 font-bold text-2xl">{t("create.title")}</span>}
                    onCancel={() => setOpen(false)}
                >
                    <EventCreateForm onSubmit={onSubmit} onClose={() => setOpen(false)} message={t("create.created")}/>
                </Modal>
            )}
        </>
    )
}
export default EventCreatorModal
