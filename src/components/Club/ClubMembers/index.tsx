import React, {useCallback, useContext, useEffect, useState} from "react"
import {ClubMember} from "../../../data/club/types"
import {getMembers} from "../../../data/club"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {getCurrentSchoolYear} from "../../../util"
import {faPencilAlt, faTimes} from "@fortawesome/free-solid-svg-icons"
import MemberCard from "./MemberCard"
import ClubSchoolSessionsSelect from "./ClubSchoolSessionsSelect"
import ClubMemberSkeleton from "../../Skeletons/ClubMemberSkeleton"
import ClubMemberEditor from "../ClubAdmin/ClubMemberEditor"
import ClubMemberAdder from "../ClubAdmin/ClubMemberAdder"
import {ClubContext} from "../../../context/club/context"


const ClubMembers: React.FC = () => {
    const {club: {id, canEdit}} = useContext(ClubContext)
    const [loading, setLoading] = useState(true)
    const [members, setMembers] = useState<ClubMember[]>([])
    const [editionMode, setEditionMode] = useState(false)
    const [selectedYear, setSelectedYear] = useState<number>(getCurrentSchoolYear())
    const toggleEditionMode = useCallback(() => setEditionMode(prevState => !prevState), [])

    const onDelete = useCallback((id: number) => {
        setMembers(prevMembers => prevMembers.filter(m => m.id != id))
    }, [])

    const onUpdate = useCallback((updateMember: ClubMember) => {
        setMembers(prevMembers => prevMembers.map(m => m.id == updateMember.id ? updateMember : m))
    }, [])

    const onAdd = useCallback((newMember: ClubMember) => {
        setMembers(prevMembers => [...prevMembers, newMember])
    }, [])

    useEffect(() => {
        setLoading(true)
        getMembers(id, selectedYear).then(res =>
            setMembers(res.data)
        ).finally(() => setLoading(false))
    }, [id, selectedYear])

    return (
        <div className="container mx-auto relative h-full py-4">
            <div className="flex justify-end item-center mb-2">
                <ClubSchoolSessionsSelect club={id} handleChange={setSelectedYear}/>
                {canEdit && (
                    <div
                        onClick={toggleEditionMode}
                        className="text-xl flex w-10 h-10 justify-center items-center rounded-full hover:bg-gray-200 transition-colors cursor-pointer group mx-2"
                    >
                        <FontAwesomeIcon
                            className="cursor-pointer text-gray-700 text-opacity-60 mx-1 group-hover:text-opacity-100 transition-colors"
                            icon={editionMode ? faTimes : faPencilAlt}
                        />
                    </div>
                )}
            </div>

            <div className="flex flex-wrap justify-center h-full">
                {loading ?
                    <ClubMemberSkeleton amount={5} loading={true}/> :
                    members.map(m => editionMode ?
                        <ClubMemberEditor
                            key={m.id}
                            m={m}
                            onDelete={onDelete}
                            onUpdate={onUpdate}
                        /> :
                        <MemberCard key={m.id} id={m.id} m={m} showRole={canEdit}/>
                    )
                }
                {editionMode && <ClubMemberAdder club={id} year={selectedYear} onAdd={onAdd}/>}
            </div>
        </div>
    )
}
export default ClubMembers
