import React, {useCallback, useState} from "react"
import {ClubMember} from "../../../data/club/types"
import {useTranslation} from "react-i18next"
import StudentPicker from "../../Student/StudentPicker"
import {Button} from "antd"
import {PlusSquareOutlined} from "@ant-design/icons"
import {addClubMember} from "../../../data/club"

type ClubMemberAdderProps = {
    club: number
    onAdd: (cm: ClubMember) => void
}
const ClubMemberAdder: React.FC<ClubMemberAdderProps> = ({club, onAdd}) => {
    const {t} = useTranslation("club")
    const [student, setStudent] = useState<number>()

    const addMember = useCallback(() => {
        if (student) {
            addClubMember(club, student).then(res => {
                if (res.status === 200)
                    onAdd(res.data)
            })
        }
    }, [student])
    return (
        <div className="h-64 flex flex-col items-center">
            <h1 className="font-dinotcb text-xl text-gray-600 uppercase self-start">{t("add_member")}</h1>

            <StudentPicker className="w-64 my-10" onChange={(id) => setStudent(id)}/>

            {student &&
            <Button className="rounded mt-5" type="primary" onClick={addMember}>
                {t("add")} <PlusSquareOutlined className="align-baseline"/>
            </Button>
            }
        </div>
    )
}

export default ClubMemberAdder