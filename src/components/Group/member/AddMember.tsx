import React, {useCallback, useEffect, useRef, useState} from "react"
import StudentSelector from "../../Student/StudentSelector"
import {useTranslation} from "react-i18next"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlus } from "@fortawesome/free-solid-svg-icons"
import StudentPicker from "../../Student/StudentPicker"

type AddMemberProps = {
    onAdd: (id: number) => void
}
const AddMember: React.FC<AddMemberProps> = ({onAdd}) => {
    const {t} = useTranslation("group")

    const onSelect = useCallback((id, metq)=> onAdd(id), [onAdd])
    const [selected, setSelected] = useState(false)
    const selectorRef = useRef<HTMLButtonElement>(null)

    const input = selectorRef.current?.querySelector("input")

    useEffect(() => {
        if(input && selected){
            input.focus()

            const fnc = (event: MouseEvent) => setSelected(false)
            setTimeout(() => window.addEventListener("click", fnc))
            
            return () => window.removeEventListener("click", fnc)
        }else if(input)
            input.blur()
    }, [input, selected])
    return (
        <div className={"flex justify-center mt-1 "+(selected && "mr-2")}>
            <button
                ref={selectorRef}
                onClick={()=>setSelected(true)}
                className={"flex items-center mx-auto bg-indigo-400 text-base text-white cursor-pointer opacity-100 hover:opacity-80 duration-200 " + (selected ? "w-full py-1 px-2.5 rounded-lg h-10" : "w-8 h-8 px-2 py-2 rounded-full")}
            >
                <FontAwesomeIcon icon={faPlus} className="w-4 h-4 block flex-shrink-0"/>
                <StudentPicker
                    className="w-full ml-2 opacity-40 rounded-lg overflow-hidden"
                    placeholder={t("add_member")}
                    onChange={onSelect}
                />
            </button>
        </div>
    )
}

export default AddMember