import React, { ChangeEvent, CSSProperties, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import {Divider, Skeleton} from "antd"
import {useTranslation} from "react-i18next"
import {GroupMember} from "../../../data/group/types"
import StudentAvatar from "../../Student/StudentAvatar"
import DropdownPanel from "../../Common/DropdownPanel"
import DropdownPanelElement from "../../Common/DropdownPanelElement"
import { faArrowDown, faArrowUp, faSearch, faTrashAlt } from "@fortawesome/free-solid-svg-icons"
import { AppContext } from "../../../context/app/context"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Link } from "react-router-dom"
import { Virtuoso } from "react-virtuoso"

type GroupMembersPanelProps = {
    loadMembers: () => void
    fullMembersLoaded: boolean
    orgaLoading: boolean
    orga: GroupMember[][]
    onDelete: (id: number) => () => void
    onPromote: (id: number) => () => void
    onDemote: (id: number) => () => void
    hasRight?: boolean
    style?: CSSProperties
    className?: string
}
const sections = ["admins", "members", ]
const GroupMembersPanel: React.FC<GroupMembersPanelProps> = ({orga, loadMembers, orgaLoading, fullMembersLoaded, onDelete, onPromote, onDemote, hasRight, style, className}) => {
    const {t} = useTranslation("group")
    const loading = useMemo(()=>orga[0].length == 0 || orgaLoading || !fullMembersLoaded, [orga])

    const {state: {user}} = useContext(AppContext)

    const skeletonLength = useMemo(() => Array(4 * 2).fill(0).map(() => 80 + Math.random() * 70), [])

    const [search, setSearch] = useState("")
    const onChange = useCallback((event: ChangeEvent) => 
        setSearch((event.target as HTMLInputElement).value.toLowerCase())
    , [])

    const adminKeyGenerator = useCallback((index: number) =>
        orga[0][index]?.id
    , [])

    const membersKeyGenerator = useCallback((index: number) =>
        orga[1][index]?.id
    , [])

    const itemCache = useRef<{[key: number]: JSX.Element}>({})
    
    useEffect(() => {
        if(!orgaLoading && !fullMembersLoaded){
            itemCache.current = {}
            loadMembers?.()
        }
    }, [!orgaLoading && !fullMembersLoaded, loadMembers])

    const renderItem = useCallback((member: GroupMember, admin: boolean) => 
        itemCache.current[member.id] ?? (itemCache.current[member.id] = <Link to={() => `/student/${member.student.id}`}>
            <div key={member.id} className="w-full flex items-center font-semibold text-neutral-600 hover:bg-black/5 p-2 rounded-lg transition-colors cursor-pointer">
                <StudentAvatar 
                    id={member.student.id}
                    name={member.student.firstName+" "+member.student.lastName}
                    picture={member.student.picture}
                    size="default"
                />
                <div className="ml-2">{member.student.firstName+" "+member.student.lastName}</div>
                
                {member.student.id != user.id && hasRight && 
                    <DropdownPanel
                        panelClassName="w-32 right-0 lg:left-0"
                        closeOnClick={true}
                        buttonClassName="mr-0 ml-auto"
                    >
                        <DropdownPanelElement onClick={!admin ? onPromote(member.id) : onDemote(member.id)} icon={!admin ? faArrowUp : faArrowDown} title={t(admin ? "demote" : "promote")}></DropdownPanelElement>
                        <DropdownPanelElement onClick={onDelete(member.id)} icon={faTrashAlt} title={t("kick")} color="red"></DropdownPanelElement>
                    </DropdownPanel>
                }
            </div>
        </Link>), [])

    const searched = useMemo(() =>
        search.length == 0 ? orga[1] : orga[1].filter(member => (member.student.firstName+" "+member.student.lastName).toLowerCase().includes(search))
    , [orga[1], search])

    const renderMemberItem = useCallback((index: number) => {
        const member = searched[index]
        return renderItem(member, false)
    }, [searched, renderItem])
    const renderAdminItem = useCallback((index: number) => {
        const member = orga[0][index]
        return renderItem(member, false)
    }, [orga[0], renderItem])

    return (
        <div className={`${className}`} style={style}>
            <Divider className="text-gray-700 text-lg" orientation="left">
                {t("members")}
                {!loading && <label className="text-neutral-400 text-base"> · {orga.reduce((prev, arr) => prev + arr.length, 0)}</label>}
            </Divider>
            {sections.map((name, index) => (!!orga[index].length || loading) && <>
                <div key={index} className="flex flex-col p-4 shadow-sm rounded-lg bg-white my-5 w-full">
                    <div className="font-semibold text-base text-neutral-700 mb-2">
                        {t(name)}
                        {loading || <label className="text-neutral-400 text-sm"> · {orga[index].length}</label>}
                    </div>
                    {index != 0 &&
                        <div className="w-full bg-black/5 rounded-full px-3 py-1.5 mb-2 flex items-center">
                            <FontAwesomeIcon
                                icon={faSearch}
                                className="text-neutral-400"
                            ></FontAwesomeIcon>
                            <input onChange={onChange} className="w-full bg-transparent ml-2 outline-none" placeholder={t("search")}></input>
                        </div>
                    }
                    {loading ? 
                        skeletonLength.slice(index * 4, index * 4 + 4).map((length, id) =>
                            <div key={id} className="w-full flex items-center font-semibold text-neutral-600 hover:bg-black/5 p-2 rounded-lg transition-colors cursor-pointer">
                                <Skeleton.Avatar className="w-8 h-8" />
                                <Skeleton
                                    className="ml-2 mt-2 -mb-2"
                                    active
                                    title={false}
                                    paragraph={{ rows: 1, width: length }}
                                />
                                {hasRight && <DropdownPanel
                                    panelClassName="w-32 right-0 lg:left-0"
                                    buttonClassName="mr-0 ml-auto"
                                    clickable={false}
                                />}
                            </div>
                        )
                        
                        :

                        <Virtuoso
                            computeItemKey={index == 0 ? adminKeyGenerator : membersKeyGenerator}
                            increaseViewportBy={52}
                            customScrollParent={document.getElementById("main")!}
                            totalCount={(index == 0 ? orga[0] : searched).length}
                            itemContent={index == 0 ? renderAdminItem : renderMemberItem}
                        />
                    }
                </div>
            </>)}
                
        </div>  
    )
}

export default GroupMembersPanel