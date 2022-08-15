import React from "react"
import {
    faHouseCircleCheck,
    faHouseCircleXmark,
    faHouseFlag,
    faPen,
    faThumbtack,
    faUnlink
} from "@fortawesome/free-solid-svg-icons"
import {faTrashAlt} from "@fortawesome/free-regular-svg-icons"
import {useTranslation} from "react-i18next"
import DropdownPanelElement from "../Common/DropdownPanelElement"
import useAdminRole from "../../hooks/useAdminRole"

type PostToolbarProps = {
    pinned: boolean,
    homepageForced: boolean
    feed?: number
    triggerPin: (homepage: boolean) => () => void
    triggerHomepageForced: () => void
    triggerEdition: () => void
    triggerDeletion: () => void
    noPinned?: boolean
}
const PostToolbar: React.FC<PostToolbarProps> = ({feed, pinned, noPinned, homepageForced,  triggerDeletion, triggerPin, triggerEdition, triggerHomepageForced}) => {
    const {t} = useTranslation(["common", "post"])
    const isAdmin = useAdminRole()

    return (
        <div className="select-none edit-menu text-base font-medium">
            {feed !== undefined && !noPinned && (
                <DropdownPanelElement
                    title={t(`post:${pinned ? "unpin" : "pin"}`)}
                    onClick={triggerPin(false)}
                    icon={pinned ? faUnlink : faThumbtack}
                />
            )}
            {isAdmin && !noPinned && (
                <>
                    <DropdownPanelElement
                        title={t("post:homepage_forced")}
                        onClick={triggerHomepageForced}
                        icon={homepageForced ? faHouseCircleXmark: faHouseCircleCheck}
                    />
                    <DropdownPanelElement
                        title={t("post:homepage_pin")}
                        onClick={triggerPin(true)}
                        icon={faHouseFlag}
                    />
                </>
            )}
            <DropdownPanelElement
                title={t("edit")}
                onClick={triggerEdition}
                icon={faPen}
            />
            <DropdownPanelElement
                title={t("delete")}
                onClick={triggerDeletion}
                icon={faTrashAlt}
                color="red"
            />
        </div>
    )
}

export default PostToolbar