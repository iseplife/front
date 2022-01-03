import React, {useCallback, useState} from "react"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faEllipsisH, faPen, faThumbtack, faUnlink} from "@fortawesome/free-solid-svg-icons"
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
    const [showMenu, setShowMenu] = useState<boolean>(false)

    const closeMenuWrapper = useCallback((fn) => () => {
        fn()
        setShowMenu(false)
    }, [])

    return (
        <div className="relative">
            <div
                className="cursor-pointer group rounded-full hover:bg-indigo-700 hover:bg-opacity-10 transition-colors mr-3 md:mr-4 w-9 h-9 items-center flex justify-center"
                onClick={() => setShowMenu(show => !show)}>
                <FontAwesomeIcon
                    icon={faEllipsisH}
                    className="text-gray-400 group-hover:text-indigo-400 transition-colors"
                />
            </div>
            {showMenu &&
                <div
                    className="select-none edit-menu absolute top-10 right-4 rounded bg-white border-gray-300 border-opacity-70 border w-32 text-base font-medium z-20"
                >
                    <div
                        onClick={closeMenuWrapper(triggerEdition)}
                        className="flex items-center w-full text-gray-500 px-3 py-2 cursor-pointer hover:bg-gray-100 hover:bg-opacity-80 transition-colors"
                    >
                        <FontAwesomeIcon
                            icon={faPen}
                            className="mr-2.5"
                        /> {t("edit")}
                    </div>
                    <div
                        onClick={closeMenuWrapper(triggerPin)}
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
                        onClick={closeMenuWrapper(triggerDeletion)}
                        className="flex items-center w-full text-red-600 px-3 py-2 cursor-pointer hover:bg-red-50 transition-colors"
                    >
                        <FontAwesomeIcon
                            icon={faTrashAlt}
                            className="mr-2.5"
                        /> {t("delete")}
                    </div>
                </div>
            }
        </div>
    )
}

export default PostToolbar