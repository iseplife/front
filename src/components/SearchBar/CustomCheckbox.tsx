import React from "react"

interface CustomCheckBoxProps {
    title: string
    filterStatus: boolean
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const CustomCheckbox: React.FC<CustomCheckBoxProps> = ({title, filterStatus, onChange}) => (
    <>
        <input type="checkbox" className="appearance-none pills"
            id={`switch-${title.toLowerCase()}`}
            onMouseDown={e => e.preventDefault()}
            onChange={onChange} checked={filterStatus}/>
        <label
            className="label-pills inline-flex items-center rounded-full border text-xs
                    border-indigo-500 text-indigo-500 px-2 my-auto mx-1 ml-1 cursor-pointer
                    hover:text-white hover:bg-indigo-700 active:bg-indigo-500 active:text-white"
            htmlFor={`switch-${title.toLowerCase()}`}>{title}</label>
    </>
)

export default CustomCheckbox