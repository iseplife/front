import React from "react"
import {SearchItemType} from "../../data/searchbar/types"
import {Avatar} from "antd"
import {IconFA} from "../Common/IconFA"
import {SelectInputProps} from "./index"
import {mediaPath} from "../../util"
import {AvatarSizes} from "../../constants/MediaSizes"

const AvatarSearchType: React.FC<{ props: SelectInputProps }> = ({props}) => {
    let iconType = ""
    if (props.type === SearchItemType.STUDENT)
        iconType = "user"
    if (props.type === SearchItemType.EVENT)
        iconType = "calendar-day"
    if (props.type === SearchItemType.CLUB)
        iconType = "users"
    return (
        <>
            <Avatar
                src={props.thumbURL && mediaPath(props.thumbURL, AvatarSizes.THUMBNAIL)}
                size={"small"}
                shape={"circle"}
            >
                {props.text.split(" ")[0].slice(0, 1)}
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