import React, {useCallback, useContext, useState} from "react"
import {Club, ClubMember} from "../../../data/club/types"
import {useTranslation} from "react-i18next"
import StudentPicker from "../../Student/StudentPicker"
import {Button} from "antd"
import {addClubMember} from "../../../data/club"
import {ClubContext} from "../../../context/club/context"
import {ClubActionType} from "../../../context/club/action"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {faPlus} from "@fortawesome/free-solid-svg-icons"

type ClubMemberAdderProps = {
    onAdd: (cm: ClubMember) => void
}
const ClubMemberAdder: React.FC<ClubMemberAdderProps> = ({onAdd}) => {
    const {t} = useTranslation("club")
    const {state: { club: {data}}, dispatch} = useContext(ClubContext)
    const club = data as Club

    const [student, setStudent] = useState<number>()

    const addMember = useCallback(() => {
        if (student) {
            addClubMember(club.id, student).then(res => {
                if (res.status === 200){
                    dispatch({type: ClubActionType.ADD_MEMBER, payload: res.data})
                    onAdd(res.data)
                }
            })
        }
    }, [student, club.id, onAdd])
    return (
        <div className="h-64 flex flex-col items-center">
            <h1 className="text-xl text-gray-600 uppercase self-start">{t("add_member")}</h1>

            <StudentPicker className="w-64 my-10" onChange={(id) => setStudent(id)}/>

            {student &&
            <Button className="rounded mt-5" type="primary" onClick={addMember}>
                {t("add")} <FontAwesomeIcon icon={faPlus} className="ml-2"/>
            </Button>
            }
        </div>
    )
}

export default ClubMemberAdder
