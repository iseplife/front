import React, {useEffect, useState} from "react"
import {getEvent} from "../../data/event"
import {Event} from "../../data/event/types"
import Loading from "../Common/Loading"

type ModalEventProps = {
    id: number
}
const ModalEventContent: React.FC<ModalEventProps> = ({id}) => {
    const [event, setEvent] = useState<Event | undefined>()
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        setLoading(true)
        getEvent(id).then(res => {
            setEvent(res.data)
        }).finally(() => setLoading(false))
    }, [id])

    return loading ?
        <div className="flex items-center justify-center">
            <Loading size="3x"/>
        </div>
        :
        <div className="h-full flex flex-col">
            <div>
                
            </div>
        </div>
}

export default ModalEventContent