import React from "react"
import {Popover} from "antd"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faQuestionCircle} from "@fortawesome/free-solid-svg-icons"

type HelperIconProps = {
    text: string
}

const HelperIcon: React.FC<HelperIconProps> = ({text}) => (
    <Popover
        title=""
        trigger="hover"
        content={<p className="font-dinotl text-xs">{text}</p>}
    >
        <span className="ml-2 cursor-pointer">
            <FontAwesomeIcon icon={faQuestionCircle}/>
        </span>
    </Popover>
)

export default HelperIcon
