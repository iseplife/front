import React, {useCallback, useContext, useEffect, useState} from "react"
import {ClubMember} from "../../../data/club/types"
import {getMembers} from "../../../data/club"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {getCurrentSchoolYear} from "../../../util"
import {faCheck, faPencilAlt} from "@fortawesome/free-solid-svg-icons"
import MemberCard from "./MemberCard"
import ClubSchoolSessionsSelect from "./ClubSchoolSessionsSelect"
import ClubMemberSkeleton from "../../Skeletons/ClubMemberSkeleton"
import ClubMemberEditor from "../ClubAdmin/ClubMemberEditor"
import ClubMemberAdder from "../ClubAdmin/ClubMemberAdder"
import {ClubContext} from "../../../context/club/context"
import EasterEgg from "../../EasterEgg/EasterEgg"


const ClubMembers: React.FC = () => {
    const {state: {club, cache}} = useContext(ClubContext)
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

        if(!club?.canEdit)
            setEditionMode(false)
        if(club?.id)
            getMembers(club?.id, selectedYear).then(res =>
                setMembers(res.data)
            ).finally(() => setLoading(false))
    }, [club?.canEdit, club?.id, selectedYear])

    return (
        <div className="container mx-auto relative h-full py-3">
            

            <div className="flex items-center mb-2">
                <div className="w-full my-3 border-t mr-4"></div>
                {(club ?? cache)?.id && <ClubSchoolSessionsSelect club={(club ?? cache)!.id} handleChange={setSelectedYear}/>}
                
                {club?.canEdit && (
                    <div className="text-right px-2 mb-2">
                        <div
                            onClick={toggleEditionMode}
                            className="cursor-pointer text-xl"
                        >
                            <FontAwesomeIcon
                                className={"transition-colors duration-100 ml-1 " + (editionMode ? "text-green-500  hover:text-green-600" : "text-gray-500  hover:text-gray-600")}
                                icon={editionMode ? faCheck : faPencilAlt}
                            />
                        </div>
                    </div>
                )}

            </div>

            <div className="flex flex-wrap justify-center">
                {loading ?
                    <ClubMemberSkeleton amount={5} /> :
                    members.map(m => editionMode ?
                        <ClubMemberEditor
                            key={m.id}
                            m={m}
                            onDelete={onDelete}
                            onUpdate={onUpdate}
                        /> :
                        <MemberCard key={m.id} id={m.id} m={m} showRole={club?.canEdit}/>

                    )
                }
                {editionMode && <ClubMemberAdder club={club!.id} year={selectedYear} onAdd={onAdd}/>}
                {club?.id===95?
                    <div className={"mt-4 mx-2"}>
                        <EasterEgg id={11} name={"pas invité"}></EasterEgg>
                    </div>
                    :
                    <></>
                }
            </div>
        </div>
    )
}
export default ClubMembers
