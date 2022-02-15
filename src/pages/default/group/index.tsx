import React, {useCallback, useEffect, useMemo, useState} from "react"
import {useParams} from "react-router-dom"
import {Group as GroupType, GroupMember} from "../../../data/group/types"
import {addGroupMember, deleteGroupMember, demoteGroupMember, getGroup, getGroupMembers, promoteGroupMember} from "../../../data/group"
import {message} from "antd"
import IncomingEvents from "../../../components/Event/IncomingEvents"
import GroupMembers from "../../../components/Group/member/GroupMembers"
import {useTranslation} from "react-i18next"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import { faGlobeEurope, faLock } from "@fortawesome/free-solid-svg-icons"
import CompressedMembers from "../../../components/Common/CompressedMembers"
import GroupMembersPanel from "../../../components/Group/member/GroupMembersPanel"
import Feed from "../../../components/Feed"
import AddMember from "../../../components/Group/member/AddMember"

interface ParamTypes {
    id?: string
}
export enum GroupPanel {
    POSTS,
    MEMBERS,
}
const Group: React.FC = () => {
    const {t} = useTranslation("group")
    const {id: idStr} = useParams<ParamTypes>()
    const id = useMemo(() => parseInt(idStr || ""), [idStr])
    const [group, setGroup] = useState<GroupType>()
    const [loading, setLoading] = useState<boolean>(false)
    const [orgaLoading, setOrgaLoading] = useState<boolean>(true)
    const [panel, setPanel] = useState<GroupPanel>(GroupPanel.POSTS)

    useEffect(() => {
        if (!isNaN(+id)) {
            setLoading(true)
            getGroup(id).then(res => {
                setGroup(res.data)

            }).finally(() => setLoading(false))
        }
    }, [id])

    const [orga, setOrga] = useState<GroupMember[][]>([[], []])

    useEffect(() => {
        setOrgaLoading(true)
        getGroupMembers(id).then(res =>
            setOrga((res.data).reduce((acc: GroupMember[][], curr) => {
                acc[curr.admin ? 0 : 1].push(curr)
                return acc
            }, [[], []]))
        ).finally(() => setOrgaLoading(false))
    }, [])
    const onAdd = useCallback((studentId: number) => {
        addGroupMember(id, studentId).then((res) => {
            setOrga(org => {
                return [org[0], [res.data, ...org[1]]]
            })
            message.success(t("member_added"))
        })
    }, [])

    const onDelete = useCallback((memberId: number) => () => {
        deleteGroupMember(id, memberId).then(() => {
            message.success(t("member_removed"))
            setOrga(org => {
                return [
                    org[0],
                    org[1].filter(m => m.id !== memberId)
                ]
            })
        })
    }, [])

    const onDemote = useCallback((memberId: number) => () => {
        demoteGroupMember(id, memberId).then(() => {
            setOrga(org => {
                const index = org[0].findIndex(m => m.id === memberId)
                const member = org[0].splice(index, 1)[0]

                return [[...org[0]], [...org[1], member]]
            })
            message.success(t("demote_member"))
        })
    }, [])
    const onPromote = useCallback((memberId: number) => () => {
        promoteGroupMember(id, memberId).then(() => {
            setOrga(org => {
                const index = org[1].findIndex(m => m.id === memberId)
                const member = org[1].splice(index, 1)[0]

                return [[...org[0], member], [...org[1]]]
            })
            message.success(t("promote_member"))
        })
    }, [])
    const openMembersPanel = useCallback(() => setPanel(GroupPanel.MEMBERS), []),
        openPostsPanel = useCallback(() => setPanel(GroupPanel.POSTS), [])

    return (
        <div className="sm:mt-5 flex justify-center container mx-auto md:flex-nowrap flex-wrap">
            <div className="flex-1 mx-4">
                {group && (
                    <div className="flex p-1 mb-1 items-center ">
                        <div>
                            <h3 className="mb-0 text-2xl text-black font-semibold">
                                {group.name}
                            </h3>
                            <h6 className="text-base font-normal text-gray-500 flex items-center ml-0.5">
                                <FontAwesomeIcon className="mr-1.5 text-sm"  icon={group.restricted ? faLock : faGlobeEurope}/>
                                {t(group.restricted ? "restricted" : "public")}
                            </h6>
                        </div>
                    </div>
                )}

                {!orgaLoading &&
                    <div className="sm:hidden">
                        <CompressedMembers onClick={openMembersPanel} className="w-full cursor-pointer" members={[...orga[0], ...orga[1]].map(member => member.student)} />
                        {group?.hasRight && <AddMember onAdd={onAdd} />}
                    </div>
                }
                <IncomingEvents feed={group?.feed} wait={loading} allowCreate={group?.hasRight} className="lg:hidden block" />
                <div className="ant-divider ant-devider-horizontal mb-3 self-center hidden sm:grid"></div>
                <div className="hidden sm:block">
                    <GroupMembers openMembersPanel={openMembersPanel} hasRight={group?.hasRight} onAdd={onAdd} onDelete={onDelete} onDemote={onDemote} onPromote={onPromote} orga={orga} loading={orgaLoading} />
                </div>
            </div>
            <div style={{flex: "2 1 0%"}} className="mx-4 md:mx-10">
                <div className="flex font-semibold text-neutral-600 mt-3">
                    <div onClick={openPostsPanel} className={"rounded-full bg-black bg-opacity-[8%] hover:bg-opacity-[12%] transition-colors px-3 py-1 cursor-pointer "+(panel != GroupPanel.MEMBERS && "bg-opacity-[15%] hover:bg-opacity-20 text-neutral-700")}>Publications</div>
                    <div onClick={openMembersPanel} className={"rounded-full bg-black bg-opacity-[8%] hover:bg-opacity-[12%] transition-colors px-3 py-1 cursor-pointer ml-2.5 "+(panel == GroupPanel.MEMBERS && "bg-opacity-[15%] hover:bg-opacity-20 text-neutral-700")}>Membres</div>
                </div>
                {
                    panel == GroupPanel.MEMBERS && 
                        <GroupMembersPanel onDelete={onDelete} onPromote={onPromote} onDemote={onDemote} orga={orga} />
                }
                {
                    panel == GroupPanel.POSTS && 
                        <Feed id={group?.feed} loading={!group} />
                }
                
            </div>
            <div className="flex-1 lg:block hidden mr-4">
                <IncomingEvents feed={group?.feed} wait={loading} allowCreate={group?.hasRight}/>
            </div>
        </div>
    )
}

export default Group
