import React from "react"
import {Skeleton} from "antd"
import MemberList, { MEMBER_PREVIEW_COUNT } from "../MemberList"
import {useTranslation} from "react-i18next"
import {GroupMember} from "../../../data/group/types"
import AdminAction from "./AdminAction"
import AddMember from "./AddMember"
import CompressedMembers from "../../Common/CompressedMembers"

type GroupMembersProps = {
    orga: GroupMember[][]
    onAdd: (id: number) => void
    onDelete: (id: number) => () => void
    onPromote: (id: number) => () => void
    onDemote: (id: number) => () => void
    openMembersPanel: () => void
    loading: boolean
    hasRight?: boolean
}
const GroupMembers: React.FC<GroupMembersProps> = ({orga, onAdd, onDemote, onPromote, onDelete, openMembersPanel, loading, hasRight = false}) => {
    const {t} = useTranslation("group")
    return (
        loading ?
            <>
                <Skeleton title paragraph={{rows: 0}}/>
                <Skeleton avatar paragraph={{rows: 0}}/>
                <Skeleton avatar paragraph={{rows: 0}}/>
                <Skeleton avatar paragraph={{rows: 0}}/>

                <Skeleton title paragraph={{rows: 0}}/>
                <Skeleton avatar paragraph={{rows: 0}}/>
                <Skeleton avatar paragraph={{rows: 0}}/>
                <Skeleton avatar paragraph={{rows: 0}}/>
            </> :
            <div>
                <h3 className="text-gray-800 text-lg mt-3 mb-1">{t("admins")}</h3>
                <MemberList
                    members={orga[0].slice(0, MEMBER_PREVIEW_COUNT)}
                    actions={id => hasRight ? <AdminAction onDelete={onDelete(id)} onDemote={onDemote(id)}/> : <></>}
                />
                    
                {orga[0].length > MEMBER_PREVIEW_COUNT &&
                    <CompressedMembers
                        onClick={openMembersPanel}
                        className="cursor-pointer hover:bg-black hover:bg-opacity-5 transition-colors rounded-lg p-2 w-full"
                        members={orga[0].slice(MEMBER_PREVIEW_COUNT).map(member => member.student)}
                    />
                }

                <h3 className="text-gray-800 text-lg mt-3">{t("members")}</h3>
                {orga[1].length != 0 && <>
                    <MemberList
                        members={orga[1].slice(0, MEMBER_PREVIEW_COUNT)}
                        actions={id => hasRight ? <AdminAction onDelete={onDelete(id)} onPromote={onPromote(id)}/> : <></>}
                    />
                    
                    {orga[1].length > MEMBER_PREVIEW_COUNT &&
                        <CompressedMembers
                            onClick={openMembersPanel}
                            className="cursor-pointer hover:bg-black hover:bg-opacity-5 transition-colors rounded-lg p-2 w-full mb-2"
                            members={orga[1].slice(MEMBER_PREVIEW_COUNT).map(member => member.student)}
                        />
                    }
                </>}
                {hasRight && <AddMember onAdd={onAdd} />}
            </div>
    )
}

export default GroupMembers