import React, {useMemo} from "react"
import {SearchItemType} from "../../data/searchbar/types"
import {Avatar} from "antd"
import {mediaPath} from "../../util"
import {AvatarSizes} from "../../constants/MediaSizes"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {faCalendarDay, faUser, faUsers, IconDefinition} from "@fortawesome/free-solid-svg-icons"

type AvatarSearchTypeProps = {
    type: SearchItemType
    text: string
    thumbURL?: string
}
const AvatarSearchType: React.FC<AvatarSearchTypeProps> = ({thumbURL, text, type}) => {
    const icon: IconDefinition = useMemo(() => {
        switch (type){
            case SearchItemType.EVENT:
                return faCalendarDay
            case SearchItemType.GROUP:
            case SearchItemType.CLUB:
                return faUsers
            case SearchItemType.STUDENT:
            default:
                return faUser
        }
    }, [type])

    return (
        <>
            <Avatar
                src={mediaPath(thumbURL, AvatarSizes.THUMBNAIL)}
                size="small"
                shape="circle"
            >
                {text.split(" ")[0].slice(0, 1)}
            </Avatar>
            <div className="z-10" style={{fontSize: ".65rem"}}>
                <FontAwesomeIcon
                    className="-ml-2 mt-3 bg-white rounded-full border-4 border-transparent text-gray-600"
                    icon={icon}
                />
            </div>
        </>
    )
}

export default AvatarSearchType
