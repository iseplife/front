import React, {useEffect, useState} from "react"
import {useParams} from "react-router-dom"
import {Group as GroupType} from "../../../data/group/types"
import {getGroup} from "../../../data/group"
import Feed from "../../../components/Feed"
import {Divider } from "antd"
import IncomingEvents from "../../../components/Event/IncomingEvents"
import GroupMembers from "../../../components/Group/GroupMembers"

const Group: React.FC = () => {
    const {id} = useParams()
    const [group, setGroup] = useState<GroupType>()
    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        if(!isNaN(id)){
            setLoading(true)
            getGroup(id).then(res => {
                setGroup(res.data)

            }).finally(() => setLoading(false))
        }
    }, [id])
    return (
        <div className="mt-5 px-3 flex">
            <div className="w-full md:w-64 lg:w-1/4 ">
                <h1 className="mx-2 text-xl p-1 mb-5 font-dinot text-gray-800">{group?.name}</h1>
                <IncomingEvents feed={group?.feed} wait={loading} className="md:hidden block"/>
                <Divider />
                <GroupMembers members={group?.members} />
            </div>
            <div className="flex-grow">
                {group && <Feed id={group.feed} />}
            </div>
            <div className="w-full md:w-64 lg:w-1/4 pl-4 justify-center md:block hidden">
                <IncomingEvents feed={group?.feed} wait={loading}/>
            </div>
        </div>
    )
}

export default Group