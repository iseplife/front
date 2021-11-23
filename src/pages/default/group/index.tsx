import React, {useCallback, useEffect, useMemo, useState} from "react"
import {useParams} from "react-router-dom"
import {Group as GroupType} from "../../../data/group/types"
import {getGroup} from "../../../data/group"
import Feed from "../../../components/Feed"
import {Divider} from "antd"
import IncomingEvents from "../../../components/Event/IncomingEvents"
import GroupMembers from "../../../components/Group/member/GroupMembers"
import {toggleSubscription} from "../../../data/feed"
import {useTranslation} from "react-i18next"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faBell, faBellSlash} from "@fortawesome/free-regular-svg-icons"

interface ParamTypes {
    id?: string
}
const Group: React.FC = () => {
    const {t} = useTranslation("group")
    const {id: idStr} = useParams<ParamTypes>()
    const id = useMemo(() => parseInt(idStr || ""), [idStr])
    const [group, setGroup] = useState<GroupType>()
    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        if (!isNaN(+id)) {
            setLoading(true)
            getGroup(id).then(res => {
                setGroup(res.data)

            }).finally(() => setLoading(false))
        }
    }, [id])

    const handleSubscription = useCallback(() => {
        if (group) {
            toggleSubscription(group.feed).then(res => {
                setGroup({
                    ...group,
                    subscribed: res.data
                })
            })
        }
    }, [group])

    return (
        <div className="sm:mt-5 flex justify-center container mx-auto md:flex-nowrap flex-wrap">
            <div className="flex-1 ml-4">
                {group && (
                    <div className="flex p-1 mb-5 items-center ">
                        <div>
                            <h3 className="mx-2 mb-0 text-2xl text-gray-700">
                                {group.name}
                                <span className="mx-2 hover:text-gray-500 cursor-pointer" onClick={handleSubscription}>
                                    <FontAwesomeIcon icon={group.subscribed ? faBellSlash: faBell}/>
                                </span>
                            </h3>
                            <h6 className="mx-2 -mt-1 uppercase text-sm font-bold text-gray-600">{t(group.restricted ? "restricted": "public")}</h6>
                        </div>
                    </div>
                )}

                {/* TODO: retirer ce menu quandn il n'y a aucun évènement à venir et qu'on est en sm (vue téléphone) */}

                <IncomingEvents className="lg:hidden block" />
                <div className="ant-divider ant-devider-horizontal mb-3 self-center hidden sm:grid"></div>
                <GroupMembers group={id} hasRight={group?.hasRight}/>
            </div>
            <div style={{flex: "2 1 0%"}} className="mx-4 md:mx-10">
                {group && <Feed id={group.feed}/>}
            </div>
            <div className="flex-1 lg:block hidden mr-4">
                <IncomingEvents feed={group?.feed} wait={loading} allowCreate={group?.hasRight}/>
            </div>
        </div>
    )
}

export default Group
