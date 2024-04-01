import React, {useCallback, useEffect, useMemo, useState} from "react"
import {useHistory, useParams} from "react-router-dom"
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
import TabsSwitcher from "../../../components/Common/TabsSwitcher"
import { SubscribableType } from "../../../data/subscription/SubscribableType"
import SubscriptionHandler from "../../../components/Subscription"
import {Subscription} from "../../../data/feed/types"
import {AxiosError} from "axios"
import EasterEgg from "../../../components/EasterEgg/EasterEgg"

interface ParamTypes {
    id?: string
}
export enum GroupPanel {
    POSTS,
    MEMBERS,
}
const Group: React.FC = () => {
    const {t} = useTranslation(["group", "common"])
    const history = useHistory()
    const {id: idStr} = useParams<ParamTypes>()
    const id = useMemo(() => parseInt(idStr || ""), [idStr])
    const [group, setGroup] = useState<GroupType>()
    const [orgaLoading, setOrgaLoading] = useState<boolean>(true)
    const [tab, setTab] = useState<GroupPanel>(GroupPanel.POSTS)
    const [fullMembersLoaded, setFullMembersLoaded] = useState<boolean>(false)

    const setTabFactory = useCallback((tab: number) => () => setTab(tab), [])

    const loadMembers = useCallback(() => {
        if (!fullMembersLoaded) {
            setOrgaLoading(orgaLoading => {
                if(!orgaLoading)
                    getGroupMembers(id, false).then(res => {
                        setOrga((res.data).reduce((acc: GroupMember[][], curr) => {
                            acc[curr.admin ? 0 : 1].push(curr)
                            return acc
                        }, [[], []]))
                        setFullMembersLoaded(true)
                    }).finally(() => setOrgaLoading(false))

                return true
            })
        }
    }, [id, fullMembersLoaded])

    useEffect(() => {
        if (!isNaN(id)) {
            getGroup(id).then(res =>
                setGroup(res.data)
            ).catch((e: AxiosError) => {
                if (e.response && e.response.status == 404)
                    history.replace("/404")
            })
        } else {
            history.replace("/404")
        }
    }, [id])

    const [orga, setOrga] = useState<GroupMember[][]>([[], []])

    useEffect(() => {
        setOrgaLoading(true)
        setFullMembersLoaded(false)
        getGroupMembers(id, true).then(res =>
            setOrga((res.data).reduce((acc: GroupMember[][], curr) => {
                acc[curr.admin ? 0 : 1].push(curr)
                return acc
            }, [[], []]))
        ).finally(() => setOrgaLoading(false))
    }, [id])

    const onAdd = useCallback((studentId: number) => {
        addGroupMember(id, studentId).then((res) => {
            setOrga(org => {
                return [org[0], [res.data, ...org[1]]]
            })
            message.success(t("member_added"))
        })
    }, [id])

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
    }, [id])

    const onDemote = useCallback((memberId: number) => () => {
        demoteGroupMember(id, memberId).then(() => {
            setOrga(org => {
                const index = org[0].findIndex(m => m.id === memberId)
                const member = org[0].splice(index, 1)[0]

                return [[...org[0]], [...org[1], member]]
            })
            message.success(t("demote_member"))
        })
    }, [id])

    const onPromote = useCallback((memberId: number) => () => {
        promoteGroupMember(id, memberId).then(() => {
            setOrga(org => {
                const index = org[1].findIndex(m => m.id === memberId)
                const member = org[1].splice(index, 1)[0]

                return [[...org[0], member], [...org[1]]]
            })
            message.success(t("promote_member"))
        })
    }, [id])

    const tabs = useMemo(() => ({
        [t("common:posts")]: <Feed
            key={`gfeed${id}`}
            id={group?.feedId}
            loading={!group}
        />,
        [t("members")]: <GroupMembersPanel loadMembers={loadMembers} orgaLoading={orgaLoading} fullMembersLoaded={fullMembersLoaded} onDelete={onDelete} onPromote={onPromote} onDemote={onDemote} orga={orga} hasRight={group?.hasRight} />,
    }), [group, onDelete, onPromote, onDemote, orga])


    const onSubscriptionUpdate = useCallback((sub: Subscription) => {
        setGroup(g => ({
            ...(g as GroupType),
            subscribed: sub
        }))
    }, [])

    return (
        <div className="sm:mt-5 grid container mx-auto sm:grid-cols-3 lg:grid-cols-4">
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
                        <div className="mr-0 ml-auto">
                            {group && (
                                <SubscriptionHandler
                                    type={SubscribableType.GROUP}
                                    subscribable={group.id}
                                    subscription={group.subscribed}
                                    onUpdate={onSubscriptionUpdate}
                                />
                            )}
                        </div>
                    </div>
                )}
                {!orgaLoading &&
                    <div className="sm:hidden">
                        <CompressedMembers
                            onClick={setTabFactory(GroupPanel.MEMBERS)}
                            className="w-full cursor-pointer"
                            members={[...orga[0], ...orga[1]].map(member => member.student)}
                        />
                        {group?.hasRight && <AddMember onAdd={onAdd} />}
                    </div>
                }
                <IncomingEvents
                    feed={group?.feedId}
                    wait={!group}
                    allowCreate={group?.hasRight}
                    className="lg:hidden block"
                />

                <div className="ant-divider ant-devider-horizontal mb-3 self-center hidden sm:grid"/>
                <div className="hidden sm:block">
                    <GroupMembers
                        openMembersPanel={setTabFactory(GroupPanel.MEMBERS)}
                        hasRight={group?.hasRight}
                        onAdd={onAdd}
                        onDelete={onDelete}
                        onDemote={onDemote}
                        onPromote={onPromote}
                        orga={orga}
                        loading={orgaLoading}
                    />
                </div>
                {group?.id===118826?
                    <div className={"mt-8"}>
                        <EasterEgg id={12} name={"orique"}></EasterEgg>
                    </div>
                    :
                    <></>
                }

            </div>

            <TabsSwitcher
                className="mx-4 md:mx-10 sm:col-span-2 mt-3"
                currentTab={tab}
                setCurrentTab={setTabFactory}
                tabs={tabs}
            />
            <div className="flex-1 lg:block hidden mr-4">
                <IncomingEvents feed={group?.feedId} wait={!group} allowCreate={group?.hasRight}/>
            </div>
        </div>
    )
}

export default Group
