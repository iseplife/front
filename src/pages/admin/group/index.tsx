import React, {useCallback, useEffect, useMemo, useState} from "react"
import {Link, useParams} from "react-router-dom"
import Table, {ColumnType, RowProps} from "../../../components/Common/TableAdmin"
import AvatarList from "../../../components/Common/AvatarList"
import {IconFA} from "../../../components/Common/IconFA"
import {PageStatus} from "../student"
import {GroupAdmin} from "../../../data/group/types"
import GroupEditor from "../../../components/Group/GroupEditor"
import {getAllGroup} from "../../../data/group"
import Pills from "../../../components/Common/Pills"
import {StudentPreview} from "../../../data/student/types"

const tableConfig: ColumnType<GroupAdmin>[] = [
    {title: "id"},
    {title: "", className: ""},
    {title: "Nom", className: "w-2/5"},
    {title: "Administrateurs", className: "w-1/3"},
    {title: ""},
    (props) => (
        <div className="cursor-pointer rounded border border-gray-300 hover:border-gray-500 py-1 px-2 w-8"
            onClick={() => props.refresh && props.refresh()}>
            <IconFA name="fa-redo"/>
        </div>
    )
]


const GroupPanel: React.FC = () => {
    const {id} = useParams()
    const [groups, setGroups] = useState<GroupAdmin[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [page, setPage] = useState<PageStatus>({current: 0})


    const fetchGroup = useCallback(() => {
        setLoading(true)
        getAllGroup(page.current).then(res => {
            if (res.status === 200) {
                setGroups(res.data.content)

                setPage(prevState => ({
                    ...prevState,
                    size: res.data.size,
                    total: res.data.totalElements
                }))
            }
        }).finally(() => setLoading(false))
    }, [page.current])

    /**
     * Fetch feeds  first page on first load
     */
    useEffect(() => {
        fetchGroup()
    }, [page.current])

    return (
        <div>
            <h1 className="font-dinotcb text-2xl text-gray-600">Groupes</h1>
            <div className="flex">
                <Table
                    className="w-full md:w-1/2"
                    loading={loading}
                    data={groups}
                    page={page}
                    refresh={fetchGroup}
                    onPageChange={(page) => setPage(prevState => ({...prevState, current: page}))}
                    row={TableRow}
                    columns={tableConfig}
                />
                <GroupEditor
                    id={id}
                    onDelete={id => setGroups(feeds => feeds.filter(s => s.id !== id))}
                    onCreate={feed => setGroups(feeds => [...feeds, feed])}
                    onUpdate={feed => setGroups(feeds => feeds.map(f => f.id === feed.id ? feed : f))}
                    onArchive={feed => setGroups(feeds => feeds.map(f => f.id === feed.id ? feed : f))}
                />
            </div>
        </div>
    )
}

const TableRow: React.FC<RowProps<GroupAdmin>> = ({data: f}) => {
    const admins = useMemo(() => f.admins.reduce((acc: StudentPreview[], curr) => {
        if(curr.admin)
            acc.push(curr.student)
        return acc
    }, []), [f.admins])
    return (
        <tr key={f.id}>
            <td className="border-b border-gray-200 text-sm leading-5 font-bold px-6 py-2">{f.id}</td>
            <td className="text-gray-400 border-b border-gray-200 text-sm leading-5 font-medium p-2">
                <IconFA name={f.restricted ? "fa-lock" : "fa-unlock"}/>
            </td>
            <td className="border-b border-gray-200 text-sm leading-5 font-medium px-6 py-2">
                <Link to={`/admin/group/${f.id}`} className="text-gray-900 hover:text-indigo-400 focus:outline-none focus:underline break-words">
                    {f.name}
                </Link>
            </td>
            <td className="border-b border-gray-200 text-sm leading-5 font-medium pl-6 py-2">
                <AvatarList users={admins}/>
            </td>
            <td className="py-2 whitespace-no-wrap border-b border-gray-200">
                <Pills status={!f.archived} className="text-xs"/>
            </td>
            <td className="p-2 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 font-medium">
                <Link
                    to={`/admin/group/${f.id}`}
                    className="text-md text-indigo-500 hover:text-indigo-300 focus:outline-none focus:underline"
                >
                    <IconFA name="fa-edit" type="regular"/>
                </Link>
            </td>
        </tr>
    )
}

export default GroupPanel