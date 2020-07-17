import React from "react"
import Modal from "../Common/Modal"

type ModalEventProps = {
    id: number
}
const ModalEvent: React.FC<ModalEventProps> = () => {
    return (
        <Modal visibleFn={() => true} visible={true}>

        </Modal>
    )
}

export default ModalEvent