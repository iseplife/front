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
            className={`mx-2 hover:text-[#fca835] text-[#e87a05] text-${className}`}
        >
            <FontAwesomeIcon icon={icon} className="text-2xl sm:text-3xl"/>
        </a>
    )
}
SocialIcon.defaultProps = {
    className: ""
}

export default SocialIcon
