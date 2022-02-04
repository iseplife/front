import React from "react"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faPen, faThumbtack, faUnlink} from "@fortawesome/free-solid-svg-icons"
import {faTrashAlt} from "@fortawesome/free-regular-svg-icons"
import {useTranslation} from "react-i18next"
import DropdownPanelElement from "../Common/DropdownPanelElement"

type PostToolbarProps = {
    pinned: boolean,
    triggerPin: () => void
    triggerEdition: () => void
    triggerDeletion: () => void
}
const PostToolbar: React.FC<PostToolbarProps> = ({pinned, triggerDeletion, triggerPin, triggerEdition}) => {
    const {t} = useTranslation(["common", "post"])

    return (
        <div className="select-none edit-menu text-base font-medium">
            <DropdownPanelElement title={t("edit")} onClick={triggerEdition} icon={faPen} />
            <DropdownPanelElement title={t(`post:${!pinned ? "un" : ""}pin`)} onClick={triggerPin} icon={pinned ? faUnlink : faThumbtack} />
            <DropdownPanelElement title={t("delete")} onClick={triggerDeletion} icon={faTrashAlt} color="red" />
        </div>
    )
}

export default PostToolbar