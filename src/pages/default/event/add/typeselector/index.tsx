import { useCallback, useState } from "react"
import DropdownPanel from "../../../../../components/Common/DropdownPanel"
import EventType, {EventTypeEmoji, EventTypes} from "../../../../../constants/EventType"
import { useTranslation } from "react-i18next"

interface EventTypeSelectorProps {
    className?: string
}

const EventTypeSelector: React.FC<EventTypeSelectorProps> = ({className}) => {
    const {t} = useTranslation("event")

    const [selectedType, setSelectedType] = useState<EventType>()

    const selectTypeFactory = useCallback((type: EventType) => () => setSelectedType(type), [])

    return <DropdownPanel
        closeOnClick
        buttonClassName={`relative ${className} grid`}
        panelClassName="absolute top-[unset] -bottom-1.5 z-[9999] translate-y-full left-0 min-w-[50%] max-w-[200px] max-h-[50vh] overflow-y-auto scrollbar-thin bg-white rounded-lg shadow-xl border border-neutral-200"
        clickable
        icon={
            <div className={`relative rounded-lg border border-neutral-200 px-3 ${selectedType ? "py-[11px]" : "py-3"} cursor-pointer text-neutral-400 text-start`}>
                {
                    selectedType ? <div className="flex items-center">
                        <div className="w-full line-clamp-1 text-ellipsis overflow-hidden text-indigo-400">{`${EventTypeEmoji[selectedType]} ${t(`type.${selectedType}`)}`}</div>
                    </div> : <>Type d'événement</>
                }
            </div>
        }
    >
        <>
            {
                EventTypes.map(e =>
                    <div onClick={selectTypeFactory(e)} className="flex items-center rounded-lg hover:bg-neutral-100 p-2 px-3 cursor-pointer">
                        <div className="overflow-hidden text-ellipsis line-clamp-1 text-indigo-400">{`${EventTypeEmoji[e]} ${t(`type.${e}`)}`}</div>
                    </div>
                )
            }
        </>
    </DropdownPanel>
}

export default EventTypeSelector