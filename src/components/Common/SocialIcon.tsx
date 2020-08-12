import React from "react"
import {IconFA} from "./IconFA"

type SocialIconProps = {
    type: string
    url: string
    className?: string
}
const SocialIcon: React.FC<SocialIconProps> = ({type, url, className}) => {
    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className={`mx-2 hover:text-indigo-300 text-indigo-500 text-${className}`}
        >
            <IconFA type="brands" name={type} className="text-2xl sm:text-4xl"/>
        </a>
    )
}
SocialIcon.defaultProps = {
    className: ""
}

export default SocialIcon