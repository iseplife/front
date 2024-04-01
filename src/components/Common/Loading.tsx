import React, {CSSProperties} from "react"
import {faCircleNotch} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon, FontAwesomeIconProps} from "@fortawesome/react-fontawesome"

type LoadingProps = {
    size?: FontAwesomeIconProps["size"]
    className?: string
    style?: CSSProperties
}
const Loading: React.FC<LoadingProps> = (p) => (
    <div className={`text-center ${p.className}`} style={p.style}>
        <FontAwesomeIcon icon={faCircleNotch} spin size={p.size} className="text-[#fcc477]"/>
    </div>
)

Loading.defaultProps = {
    className: ""
}

export default Loading
