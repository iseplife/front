import React from "react"
import {ClubMember} from "../../data/club/types"
import {Avatar, Tooltip} from "antd"
import CardTextSkeleton from "./Skeletons/CardTextSkeleton"
import {useHistory } from "react-router-dom"

type MembersProps = {
    members: ClubMember[]
    loading: boolean
}
const Members: React.FC<MembersProps> = ({members, loading}) => {
    const history = useHistory()

    return (
        <div className="w-full flex flex-row flex-wrap xl:overflow-x-hidden xl:overflow-y-hidden lg:overflow-x-hidden lg:overflow-y-hidden md:overflow-x-hidden md:overflow-y-hidden">
            {
                loading
                    ? <CardTextSkeleton loading={loading} number={10} className="xl:w-56 lg:w-56 md:w-56 w-full m-1 h-24 shadow-md" />
                    :  (
                        members.map(m => {
                            return (
                                <div
                                    key={m.id}
                                    onClick={() => history.push(`/user/${m.student.id}`)}
                                    className="m-auto xl:m-2 lg:m-2 md:m-2 cursor-pointer hover:opacity-50 shadow-md flex flex-row items-center bg-white rounded xl:w-64 lg:w-64 md:w-64 mb-4"
                                >
                                    <Avatar src={m.student.picture} className="h-16 w-16 md:h-12 md:w-12 lg:h-12 lg:w-12 xl:h-12 xl:w-12 m-3" />
                                    <div className="flex flex-col flex-no-wrap ml-2">
                                        <Tooltip title={`${m.student.firstName} ${m.student.lastName}`}>
                                            <div className="text-lg md:text-sm lg:text-sm xl:text-sm font-bold truncate w-40 xl:w-32 lg:w-32 md:w-32">{m.student.firstName} {m.student.lastName}</div>
                                        </Tooltip>
                                        <div className="italic">{m.position}</div>
                                    </div>
                                </div>
                            )
                        })
                    )
            }
        </div>
    )
}

export default Members