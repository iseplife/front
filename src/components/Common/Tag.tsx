import React from "react"

type TagProps = {
    className?: string
    selected: boolean
    onClick: () => void
}

const Tag: React.FC<TagProps> = ({children, className, selected, onClick}) => {
    return (
        <span
            className={`inline-block rounded shadow ${selected ? "bg-indigo-200 text-indigo-500": "bg-red-200 text-red-500"} m-1 px-2 py-1 text-xs  font-dinot font-semibold cursor-pointer ${className}`}
            onClick={onClick}
        >
            {children}
        </span>
    )
}

Tag.defaultProps = {
    className: "",
    selected: true
}
export default Tag