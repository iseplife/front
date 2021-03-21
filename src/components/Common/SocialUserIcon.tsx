import {Tooltip} from "antd"
import {IconFA} from "./IconFA"
import React from "react"

type SocialUserIconProps = {
    type: string
    profile: string
}
const SocialUserIcon: React.FC<SocialUserIconProps> = ({type, profile}) => {
    const urlType = type.substr(3)
    if (urlType === "snapchat")
        profile = "add/" + profile

    return (
        <Tooltip title={urlType} placement="bottom">
            <a
                href={`https://${urlType}.com/${profile}`} target="_blank"
                rel="noopener noreferrer"
                className="mx-2 text-indigo-500"
            >
                <IconFA type="brands" name={type} className="text-2xl sm:text-4xl"/>
            </a>
        </Tooltip>
    )
}

export default SocialUserIcon