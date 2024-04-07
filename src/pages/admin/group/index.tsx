import React, {useCallback, useEffect, useState} from "react"
import {Link, useParams} from "react-router-dom"
import Table, {ColumnType, RowProps} from "../../../components/Common/TableAdmin"
import {PageStatus} from "../student"
import {GroupPreview} from "../../../data/group/types"
import GroupEditor from "../../../components/Group/GroupEditor"
import {getAllGroup} from "../../../data/group"
import Pills from "../../../components/Common/Pills"
import {faLock, faRedo} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faEdit} from "@fortawesome/free-regular-svg-icons"

const tableConfig: ColumnType<GroupPreview>[] = [
    {title: "id", className:"w-min"},
    {title: "", className: "w-min"},
    {title: "Nom", className: "w-full"},
    {title: "", className: "w-min"},
    (props) => (
        <div
            className="cursor-pointer rounded text-center m-1 py-1 w-8"
            onClick={() => props.refresh && props.refresh()}
        >
            <FontAwesomeIcon icon={faRedo} className="text-gray-500 hover:text-gray-600"/>
        </div>
    )
]

interface ParamTypes {
    id?: string
}
const GroupPanel: React.FC = () => {
    const {id} = useParams<ParamTypes>()
    const [groups, setGroups] = useState<GroupPreview[]>([])
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
    }, [fetchGroup])

    return (
        <div>
            <h1 className="text-2xl text-gray-600">Groupes</h1>
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

const TableRow: React.FC<RowProps<GroupPreview>> = ({data: f}) => (
    <tr key={f.id}>
        <td className="border-b border-gray-200 text-sm leading-5 font-bold px-6 py-2">{f.id}</td>
        <td className="text-gray-400 border-b border-gray-200 text-sm leading-5 font-medium p-2">
            {f.restricted && <FontAwesomeIcon icon={faLock} /> }
        </td>
        <td className="border-b border-gray-200 text-sm leading-5 font-medium px-6 py-2">
            <Link to={`/admin/group/${f.id}`} className="text-gray-900 hover:text-indigo-400 focus:outline-none focus:underline break-words">
                {f.name}
            </Link>
        </td>
        <td className="py-2 whitespace-no-wrap border-b border-gray-200">
            <Pills status={!f.archived} className="text-xs"/>
        </td>
        <td className="p-2 whitespace-no-wrap border-b border-gray-200 text-center text-sm leading-5 font-medium">
            <Link
                to={`/admin/group/${f.id}`}
                className="text-md text-indigo-500 hover:text-indigo-300 focus:outline-none focus:underline"
            >
                <FontAwesomeIcon icon={faEdit} />
            </Link>
        </td>
    </tr>
)

export default GroupPanel
