import { Select } from "antd"
import React, {useCallback, useEffect, useState} from "react"
import {getClubSchoolSessions} from "../../../data/club"
import {getCurrentSchoolYear} from "../../../util"

const { Option } = Select

type ClubSchoolSessionsSelectProps = {
    club: number
    handleChange: (year: number) => void
}
const ClubSchoolSessionsSelect: React.FC<ClubSchoolSessionsSelectProps> = ({club, handleChange}) => {

    const [selectSchoolSession, setSelectedSchoolSection] = useState(getCurrentSchoolYear())
    const [loading, setLoading] = useState(true)
    const [schoolSessions, setSchoolSessions] = useState<number[]>([getCurrentSchoolYear()])


    useEffect(() => {
        setLoading(true)
        if(club)
            getClubSchoolSessions(club).then(res => {
                setSchoolSessions(res.data.sort((a, b) => a - b))
            }).finally(() => setLoading(false))
    }, [club])

    const changeSchoolSession = useCallback((year: number) => {
        handleChange(year)
        setSelectedSchoolSection(year)
    }, [handleChange])

    return (
        <>
            <div className="flex space-x-4 text-lg">
                {schoolSessions.map((s, i) =>
                    <div key={i} className={"h-hull flex items-center font-bold border-b-2 " + (selectSchoolSession == s ? "text-indigo-600 border-indigo-600" : "cursor-pointer border-transparent")} onClick={() => changeSchoolSession(s)}>{s}</div>
                )}
            </div>
        </>
    )
}
export default ClubSchoolSessionsSelect
