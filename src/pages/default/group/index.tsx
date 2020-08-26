import React, {useEffect, useState} from "react"
import {useParams} from "react-router-dom"
import {Group as GroupType} from "../../../data/group/types"
import {getGroup} from "../../../data/group"
import Feed from "../../../components/Feed"
import {Skeleton} from "antd";
import IncomingEvents from "../../../components/Event/IncomingEvents";

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
            <div className="w-full md:w-64 lg:w-1/4">
            </div>
            <div className="flex-grow">
                {group &&
                    <Feed id={group.feed} />
                }
            </div>
            <div>
                {loading ?
                    <Skeleton />:
                    <IncomingEvents feed={group?.feed}/>
                }
            </div>
        </div>
    )
}

export default Group