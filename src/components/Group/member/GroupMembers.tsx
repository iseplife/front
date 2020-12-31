import React, {useCallback, useEffect, useState} from "react"
import {message, Skeleton} from "antd"
import MemberList from "../MemberList"
import {useTranslation} from "react-i18next"
import {GroupMember} from "../../../data/group/types"
import AdminAction from "./AdminAction"
import MemberAction from "./MemberAction"
import {addGroupMember, deleteGroupMember, demoteGroupMember, getGroupMembers, promoteGroupMember} from "../../../data/group"
import AddMember from "./AddMember"


type MemberOrga = [GroupMember[], GroupMember[]]

type GroupMembersProps = {
    group: number
    members?: GroupMember[]
    hasRight?: boolean
}
const GroupMembers: React.FC<GroupMembersProps> = ({group, members, hasRight = false}) => {
    const {t} = useTranslation("group")
    const [loading, setLoading] = useState(true)
    const [orga, setOrga] = useState<MemberOrga>([[], []])

    useEffect(() => {
        setLoading(true)
        getGroupMembers(group).then(res =>
            setOrga((res.data).reduce((acc: MemberOrga, curr) => {
                acc[curr.admin ? 0 : 1].push(curr)
                return acc
            }, [[], []]))
        ).finally(() => setLoading(false))
    }, [])

    const onAdd = useCallback((studentId: number) => {
        addGroupMember(group, studentId).then((res) => {
            setOrga(org => {
                return [org[0], [res.data, ...org[1]]]
            })
            message.success(t("member_added"))
        })
    }, [])

    const onDelete = useCallback((id: number) => () => {
        deleteGroupMember(group, id).then(() => {
            message.success(t("member_removed"))
            setOrga(org => {
                return [
                    org[0],
                    org[1].filter(m => m.id !== id)
                ]
            })
        })
    }, [])

    const onPromote = useCallback((id: number) => () => {
        promoteGroupMember(group, id).then(() => {
            setOrga(org => {
                const index = org[1].findIndex(m => m.id === id)
                const member = org[1].splice(index, 1)[0]

                return [[...org[0], member], [...org[1]]]
            })
            message.success(t("promote_member"))
        })
    }, [])

    const onDemote = useCallback((id: number) => () => {
        demoteGroupMember(group, id).then(() => {
            setOrga(org => {
                const index = org[0].findIndex(m => m.id === id)
                const member = org[0].splice(index, 1)[0]

                return [[...org[0]], [...org[1], member]]
            })
            message.success(t("demote_member"))
        })
    }, [])

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
                <h3 className="font-dinotcb text-gray-800 text-lg mt-3">{t("admins")}</h3>
                <MemberList
                    members={orga[0]}
                    actions={id => <AdminAction onDelete={onDelete(id)} onDemote={onDemote(id)}/>}
                />

                <h3 className="font-dinotcb text-gray-800 text-lg mt-3">{t("members")}</h3>
                {hasRight && <AddMember onAdd={onAdd}/>}
                <MemberList
                    members={orga[1]}
                    actionsTrigger={0}
                    actions={id =>
                        <MemberAction onPromote={onPromote(id)} onDelete={onDemote(id)}/>
                    }
                />
            </div>
    )
}

export default GroupMembers