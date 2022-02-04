import React, { CSSProperties, useContext, useMemo } from "react"
import {Divider, Skeleton} from "antd"
import {useTranslation} from "react-i18next"
import {GroupMember} from "../../../data/group/types"
import StudentAvatar from "../../Student/StudentAvatar"
import DropdownPanel from "../../Common/DropdownPanel"
import DropdownPanelElement from "../../Common/DropdownPanelElement"
import { faArrowDown, faArrowUp, faTrashAlt } from "@fortawesome/free-solid-svg-icons"
import { AppContext } from "../../../context/app/context"

type GroupMembersViewProps = {
    orga: GroupMember[][]
    onDelete: (id: number) => () => void
    onPromote: (id: number) => () => void
    onDemote: (id: number) => () => void
    style?: CSSProperties
    className?: string
}
const sections = ["admins", "members", ]
const GroupMembersView: React.FC<GroupMembersViewProps> = ({orga, onDelete, onPromote, onDemote, style, className}) => {
    const {t} = useTranslation("group")
    const loading = useMemo(()=>orga[0].length == 0, [orga])

    const {state: {user}} = useContext(AppContext)

    const skeletonLength = useMemo(() => Array(4 * 2).fill(0).map(() => 80 + Math.random() * 70), [])
    
    return (
        <div className={`${className}`} style={style}>
            <Divider className="text-gray-700 text-lg" orientation="left">
                {t("members")}
                <label className="text-neutral-400 text-base"> · {orga.reduce((prev, arr) => prev + arr.length, 0)}</label>
            </Divider>
            {sections.map((name, index) => (!!orga[index].length || loading) && <>
                <div className="flex flex-col p-4 shadow-sm rounded-lg bg-white my-5 w-full">
                    <div className="font-semibold text-base text-neutral-700 mb-2">
                        {t(name)}
                        {loading || <label className="text-neutral-400 text-sm"> · {orga[index].length}</label>}
                    </div>
                    {
                        loading ? 
                            skeletonLength.slice(index * 4, index * 4 + 4).map(length =>
                                <div className="w-full flex items-center font-semibold text-neutral-600 hover:bg-black/5 p-2 rounded-lg transition-colors cursor-pointer">
                                    <Skeleton.Avatar className="w-8 h-8" />
                                    <Skeleton
                                        className="ml-2 mt-2 -mb-2"
                                        active
                                        title={false}
                                        paragraph={{ rows: 1, width: length }}
                                    />
                                    <DropdownPanel
                                        panelClassName="w-32 right-0 lg:left-0"
                                        buttonClassName="mr-0 ml-auto"
                                        clickable={false}
                                    >
                                    </DropdownPanel>
                                </div>
                            )
                            :
                            orga[index].map(member =>
                                <div className="w-full flex items-center font-semibold text-neutral-600 hover:bg-black/5 p-2 rounded-lg transition-colors cursor-pointer">
                                    <StudentAvatar 
                                        id={member.student.id}
                                        name={member.student.firstName+" "+member.student.lastName}
                                        picture={member.student.picture}
                                        size="default"
                                    />
                                    <div className="ml-2">{member.student.firstName+" "+member.student.lastName}</div>
                                    
                                    {member.student.id != user.id && 
                                        <DropdownPanel
                                            panelClassName="w-32 right-0 lg:left-0"
                                            closeOnClick={true}
                                            buttonClassName="mr-0 ml-auto"
                                        >
                                            <DropdownPanelElement onClick={index ? onPromote(member.id) : onDemote(member.id)} icon={index ? faArrowUp : faArrowDown} title={t(index == 0 ? "demote" : "promote")}></DropdownPanelElement>
                                            <DropdownPanelElement onClick={onDelete(member.id)} icon={faTrashAlt} title={t("kick")} color="red"></DropdownPanelElement>
                                        </DropdownPanel>
                                    }
                                </div>
                            )
                    }
                </div>
            </>)}
                
        </div>  
    )
}

export default GroupMembersView