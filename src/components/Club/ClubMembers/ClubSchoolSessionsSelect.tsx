import { Select } from "antd"
import React, {useEffect, useState} from "react"
import {getClubSchoolSessions} from "../../../data/club"
import {getCurrentSchoolYear} from "../../../util"

const { Option } = Select

type ClubSchoolSessionsSelectProps = {
    club: number
    handleChange: (year: number) => void
}
const ClubSchoolSessionsSelect: React.FC<ClubSchoolSessionsSelectProps> = ({club, handleChange}) => {
    const [loading, setLoading] = useState(true)
    const [schoolSessions, setSchoolSessions] = useState<number[]>([getCurrentSchoolYear()])


    useEffect(() => {
        setLoading(true)
        if(club)
            getClubSchoolSessions(club).then(res => {
                setSchoolSessions(res.data)
            }).finally(() => setLoading(false))
    }, [club])

    return (
        <Select className="rounded my-auto" style={{borderRadius: 10}} dropdownClassName="rounded" loading={loading} defaultValue={schoolSessions[0]} onChange={handleChange}>
            {schoolSessions.map((s, i) =>
                <Option key={i} value={s}>{s}</Option>
            )}
        </Select>
    )
}
export default ClubSchoolSessionsSelect
