import React, {useCallback, useState} from "react"
import {ClubMember} from "../../../data/club/types"
import MemberCard from "../MemberCard"
import ClubMemberEditor from "./ClubMemberEditor"
import ClubMemberAdder from "./ClubMemberAdder"

type ClubMemberEditorProps = {
    club: number
    members: ClubMember[]
}
const ClubMemberManager: React.FC<ClubMemberEditorProps> = ({club, members}) => {
    const [selectedMember, setSelectedMember] = useState<ClubMember | undefined>()
    const handleClick = useCallback((id: number) => {
        setSelectedMember(members.find(m => m.id === id))
    }, [members])
    return (
        <div className="flex m-2 rounded shadow bg-white p-3">
            <div className="md:w-1/2 w-full">
                {selectedMember ?
                    <ClubMemberEditor member={selectedMember} onCancel={() => setSelectedMember(undefined)}/> :
                    <ClubMemberAdder club={club} onAdd={cm => setSelectedMember(cm)}/>
                }
            </div>
            <div className="hidden-scroller overflow-y-auto md:w-1/2 w-full" style={{height: 300}}>
                <div className="w-full flex flex-col items-end overflow-hidden">
                    {members.map(m =>
                        <MemberCard key={m.id} m={m} onClick={handleClick} showRole={true}/>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ClubMemberManager