import React, {useCallback, useEffect, useRef, useState} from "react"

type DropdownPanelProps = {
    icon: JSX.Element
    title?: string
    closeOnClick?: boolean
    className?: string
}
const DropdownPanel: React.FC<DropdownPanelProps> = (props) => {
    const {title, icon, closeOnClick, className, children} = props
    const panelRef = useRef<HTMLDivElement>(null)
    const [open, setOpen] = useState(false)
    const toggleOpen = useCallback(() => setOpen(prev => !prev), [])

    useEffect(() => {
        if (open) {
            const func = ({target}: { target: EventTarget | null }) => {
                if (target && panelRef.current && (!panelRef.current.contains(target as HTMLElement) || closeOnClick))
                    setOpen(false)
            }
            window.addEventListener("click", func)

            return () => window.removeEventListener("click", func)
        }
    }, [open, panelRef])

    return (
        <div className="relative rounded-lg">
            <button onClick={toggleOpen}>{icon}</button>
            {open && (
                <div
                    ref={panelRef}
                    className={`
                        ${className} 
                        absolute top-10 z-20 
                        border rounded-lg shadow-lg max-h-[calc(100vh-6rem)] 
                        bg-white pb-2 text-neutral-800 overflow-auto scrollbar-thin`
                    }
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
    className: "",
    closeOnClick: false,
}

export default DropdownPanel