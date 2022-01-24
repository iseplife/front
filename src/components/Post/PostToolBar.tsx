import React from "react"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faPen, faThumbtack, faUnlink} from "@fortawesome/free-solid-svg-icons"
import {faTrashAlt} from "@fortawesome/free-regular-svg-icons"
import {useTranslation} from "react-i18next"

type PostToolbarProps = {
    pinned: boolean,
    triggerPin: () => void
    triggerEdition: () => void
    triggerDeletion: () => void
}
const PostToolbar: React.FC<PostToolbarProps> = ({pinned, triggerDeletion, triggerPin, triggerEdition}) => {
    const {t} = useTranslation(["common", "post"])

    return (
        <div
            className="select-none edit-menu text-base font-medium"
        >
            <div
                onClick={triggerEdition}
                className="flex items-center w-full text-gray-500 px-3 py-2 cursor-pointer hover:bg-gray-100 hover:bg-opacity-80 transition-colors"
            >
                <FontAwesomeIcon
                    icon={faPen}
                    className="mr-2.5"
                /> {t("edit")}
            </div>
            <div
                onClick={triggerPin}
                className="flex items-center w-full text-gray-500 px-3 py-2 cursor-pointer hover:bg-gray-100 hover:bg-opacity-80 transition-colors"
            >
                {pinned ?
                    <>
                        <FontAwesomeIcon
                            icon={faUnlink}
                            className="mr-2.5"
                        /> {t("post:unpin")}
                    </> :
                    <>
                        <FontAwesomeIcon
                            icon={faThumbtack}
                            className="mr-2.5"
                        /> {t("post:pin")}
                    </>
                }

            </div>
            <div
                onClick={triggerDeletion}
                className="flex items-center w-full text-red-600 px-3 py-2 cursor-pointer hover:bg-red-50 transition-colors"
            >
                <FontAwesomeIcon
                    icon={faTrashAlt}
                    className="mr-2.5"
                /> {t("delete")}
            </div>
        </div>
    )
}

export default PostToolbar