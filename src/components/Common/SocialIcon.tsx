import React from "react"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {IconDefinition} from "@fortawesome/fontawesome-svg-core"

type SocialIconProps = {
    icon: IconDefinition
    url: string
    className?: string
}
const SocialIcon: React.FC<SocialIconProps> = ({icon, url, className}) => {
    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className={`mx-2 hover:text-indigo-300 text-indigo-500 text-${className}`}
        >
            <FontAwesomeIcon icon={icon} className="text-2xl sm:text-3xl"/>
        </a>
    )
}
SocialIcon.defaultProps = {
    className: ""
}

export default SocialIcon
