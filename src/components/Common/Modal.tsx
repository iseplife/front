import {createPortal} from "react-dom"

const style = {
    transition: "ease-out duration-300, ease-in duration-200",
}

export type ModalProps = {
    open: boolean
    onClose?: () => void
    height?: string
    width?: string
    children: React.ReactNode
}
const Modal: React.FC<ModalProps> = ({children, open = false, onClose, width, height}) => {
    return open ?
        createPortal(
            <div style={style} className="fixed bottom-0 inset-x-0 px-4 pb-4 sm:inset-0 sm:flex sm:items-center sm:justify-center">
                <div className={`${open ? "opacity-100" : "opacity-0"} fixed inset-0 transition-opacity`}>
                    <div className="absolute inset-0 bg-gray-500 opacity-75"/>
                </div>

                <div
                    style={{...style, width, height }}
                    className={`z-50 ${open ? "opacity-100 translate-y-0 sm:scale-100": "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"} bg-white rounded-lg overflow-hidden shadow-xl transform transition-all ${width ? "": "sm:max-w-lg sm:w-full"} p-4`}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="modal-headline"
                >
                    {children}
                </div>
            </div>
            , document.body) : null
}

export default Modal
