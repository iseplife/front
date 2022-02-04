import { faEllipsisH } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React, {useCallback, useEffect, useRef, useState} from "react"

type DropdownPanelProps = {
    icon?: JSX.Element
    title?: string
    closeOnClick?: boolean
    panelClassName?: string
    buttonClassName?: string
}
const DropdownPanel: React.FC<DropdownPanelProps> = (props) => {
    const {icon, title, closeOnClick, panelClassName, buttonClassName, children} = props
    const panelRef = useRef<HTMLDivElement>(null)
    const [open, setOpen] = useState(false)
    const toggleOpen = useCallback(() => setOpen(prev => !prev), [])

    useEffect(() => {
        if (open) {
            const func = ({target}: { target: EventTarget | null }) => {
                if (target && panelRef.current && (!panelRef.current.contains(target as HTMLElement) || closeOnClick))
                    setOpen(false)
            }

            setTimeout(() => window.addEventListener("click", func))

            return () => window.removeEventListener("click", func)
        }
    }, [open, panelRef])

    return (
        <div className="relative rounded-lg">
            <button onClick={toggleOpen}>
                {icon ?? <div
                    className={`${buttonClassName} cursor-pointer group rounded-full hover:bg-indigo-700 hover:bg-opacity-10 transition-colors w-9 h-9 grid place-items-center`}
                >
                    <FontAwesomeIcon
                        icon={faEllipsisH}
                        className="text-gray-400 group-hover:text-indigo-400 transition-colors"
                    />
                </div>}
            </button>
            {open && (
                <div
                    ref={panelRef}
                    className={`${panelClassName} 
                        absolute top-10 z-20 
                        border rounded-lg shadow-lg max-h-[calc(100vh-6rem)] 
                        bg-white pb-2 text-neutral-800 overflow-auto scrollbar-thin
                    `}
                >
                    {title && (
                        <div className="font-bold text-2xl px-4 py-2.5 text-black">
                            {title}
                        </div>
                    )}
                    {children}
                </div>
            )}
        </div>
    )
}

DropdownPanel.defaultProps = {
    panelClassName: "",
    buttonClassName: "",
    closeOnClick: false,
}

export default DropdownPanel