import React, {useCallback, useEffect, useState} from "react"
import {message, Skeleton} from "antd"
import MemberList from "../MemberList"
import {useTranslation} from "react-i18next"
import {GroupMember} from "../../../data/group/types"
import AdminAction from "./AdminAction"
import MemberAction from "./MemberAction"
import {deleteGroupMember, demoteGroupMember, promoteGroupMember} from "../../../data/group";


type MemberOrga = [GroupMember[], GroupMember[]]

type GroupMembersProps = {
    group?: number
    members?: GroupMember[]
}
const GroupMembers: React.FC<GroupMembersProps> = ({group, members}) => {
    const {t} = useTranslation("group")
    const [orga, setOrga] = useState<MemberOrga>([[], []])

    useEffect(() => {
        setOrga((members || []).reduce((acc: MemberOrga, curr) => {
            acc[curr.admin ? 0 : 1].push(curr)
            return acc
        }, [[], []]))
    }, [members])


    const onDelete = useCallback((id: number) => () => {
        if(group)
            deleteGroupMember(group, id).then(res => {

                message.success(t(""))
            })

    }, [group])

    const onPromote = useCallback((id: number) => () => {
        if(group)
            promoteGroupMember(group, id).then(res => {
                setOrga(org => {
                    const index = org[1].findIndex(m => m.id === id)
                    const member = org[1].splice(index, 1)[0]

                    return [[...org[0], member], [...org[1]]]
                })
                message.success(t("promote_member"))
            })
    }, [group])

    const onDemote = useCallback((id: number) => () => {
        if(group)
            demoteGroupMember(group, id).then(res => {
                setOrga(org => {
                    const index = org[0].findIndex(m => m.id === id)
                    const member = org[0].splice(index, 1)[0]

                    return [[...org[0]], [...org[1], member]]
                })
                message.success(t("demote_member"))
            })
    }, [group])

    return (
        members ?
            <div>
                <h3 className="font-dinotcb text-gray-800 text-lg mt-3">{t("admins")}</h3>
                <MemberList
                    members={orga[0]}
                    actions={id =>
                        <AdminAction onDelete={onDelete(id)} onDemote={onDemote(id)}/>
                    }
                />

                <h3 className="font-dinotcb text-gray-800 text-lg mt-3">{t("members")}</h3>
                <MemberList
                    members={orga[1]}
                    actions={id =>
                        <MemberAction onPromote={onPromote(id)} onDelete={onDemote(id)}/>
                    }
                />
            </div> :
            <>
                <Skeleton title paragraph={{rows: 0}}/>
                <Skeleton avatar paragraph={{rows: 0}}/>
                <Skeleton avatar paragraph={{rows: 0}}/>
                <Skeleton avatar paragraph={{rows: 0}}/>

                <Skeleton title paragraph={{rows: 0}}/>
                <Skeleton avatar paragraph={{rows: 0}}/>
                <Skeleton avatar paragraph={{rows: 0}}/>
                <Skeleton avatar paragraph={{rows: 0}}/>
            </>
    )
}

export default GroupMembers