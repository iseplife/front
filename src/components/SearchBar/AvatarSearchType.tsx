import React, {useMemo} from "react"
import {SearchItemType} from "../../data/searchbar/types"
import {Avatar} from "antd"
import {IconFA} from "../Common/IconFA"
import {mediaPath} from "../../util"
import {AvatarSizes} from "../../constants/MediaSizes"

type AvatarSearchTypeProps = {
    type: SearchItemType
    text: string
    thumbURL?: string
}
const AvatarSearchType: React.FC<AvatarSearchTypeProps> = ({thumbURL, text, type}) => {
    const iconType = useMemo(() => {
        switch (type){
            case SearchItemType.STUDENT:
                return "user"
            case SearchItemType.EVENT:
                return "calendar-day"
            case SearchItemType.GROUP:
            case SearchItemType.CLUB:
                return "users"
            default:
                return ""
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
                <IconFA
                    className="-ml-2 mt-3 bg-white rounded-full border-4 border-transparent text-gray-600"
                    name={`fa-${iconType}`}
                />
            </div>
        </>
    )
}

export default AvatarSearchType