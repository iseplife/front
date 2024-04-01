import React from "react"

interface CustomCheckBoxProps {
    title: string
    filterStatus: boolean
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const CustomCheckbox: React.FC<CustomCheckBoxProps> = ({title, filterStatus, onChange}) => (
    <>
        <input
            type="checkbox"
            className="appearance-none pills"
            id={`switch-${title.toLowerCase()}`}
            onMouseDown={e => e.preventDefault()}
            onChange={onChange}
            checked={filterStatus}
        />
        <label
            htmlFor={`switch-${title.toLowerCase()}`}
            className="label-pills inline-flex items-center rounded-full border text-xs
                    border-[#e87a05] text-[#e87a05] px-2 my-auto mx-1 ml-1 cursor-pointer
                    hover:text-white hover:bg-[#ba6102] active:bg-[#e87a05] active:text-white"
        >
            {title}
        </label>
    </>
)

export default CustomCheckbox
