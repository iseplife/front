import { IconProp } from "@fortawesome/fontawesome-svg-core"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React from "react"

type DropdownPanelElementProps = {
    title: string
    icon: IconProp
    color?: "red" | "gray"
    onClick: () => void
}

const DropdownPanelColors = {
    gray: "text-gray-500 hover:bg-gray-100/80",
    red: "text-red-600 hover:bg-red-50"
}

const DropdownPanelElement: React.FC<DropdownPanelElementProps> = (props) => {
    const {icon, title, color = "gray", onClick} = props
    return (
        <div
            onClick={onClick}
            className={`flex items-center w-full px-3 py-2 cursor-pointer transition-colors ${DropdownPanelColors[color]}`}
        >
            <FontAwesomeIcon
                icon={icon}
                className="mr-2.5 w-3"
            /> {title}
        </div>
    )
}

export default DropdownPanelElement