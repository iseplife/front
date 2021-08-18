import {Tooltip} from "antd"
import React from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {IconDefinition} from "@fortawesome/free-brands-svg-icons"

type SocialUserIconProps = {
    icon: IconDefinition
    profile: string
}
const SocialUserIcon: React.FC<SocialUserIconProps> = ({icon, profile}) => {
    const urlType = icon.iconName
    if (urlType === "snapchat")
        profile = "add/" + profile

    return (
        <Tooltip title={urlType} placement="bottom">
            <a
                href={`https://${urlType}.com/${profile}`} target="_blank"
                rel="noopener noreferrer"
                className="mx-2 text-indigo-500"
            >
                <FontAwesomeIcon icon={icon} className="text-2xl sm:text-4xl"/>
            </a>
        </Tooltip>
    )
}

export default SocialUserIcon
