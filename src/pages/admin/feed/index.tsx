import React, {useCallback, useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import Table, {ColumnType, RowProps} from "../../../components/Common/TableAdmin";
import AvatarList from "../../../components/Common/AvatarList";
import {IconFA} from "../../../components/Common/IconFA";
import {PageStatus} from "../student";
import {Feed} from "../../../data/feed/types";
import {getAllFeed} from "../../../data/feed";

const tableConfig: ColumnType<Feed>[] = [
    {title: "id"},
    {title: "Nom", className: "w-2/5"},
    {title: "Administrateurs", className: "w-2/5"},
    (props) => (
        <div className="cursor-pointer rounded border border-gray-300 hover:border-gray-500 py-1 px-2 w-8" onClick={() => props.refresh && props.refresh()}>
            <IconFA name="fa-redo" type="solid" />
        </div>
    )
];


const FeedPanel: React.FC = () => {
    const {id} = useParams();
    const [feeds, setFeeds] = useState<Feed[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [page, setPage] = useState<PageStatus>({current: 0});

    const fetchFeed = useCallback(() => {
        setLoading(true);
        getAllFeed(page.current).then(res => {
            if (res.status === 200) {
                setFeeds(res.data.content);

                setPage(prevState => ({
                    ...prevState,
                    size: res.data.size,
                    total: res.data.totalElements
                }));
            }
        }).finally(() => setLoading(false))
    }, [page.current])

    /**
     * Fetch feeds  first page on first load
     */
    useEffect(() => {
        fetchFeed();
    }, [page.current]);

    return (
        <div>
            <h1 className="font-dinotcb text-2xl text-gray-600">Feeds</h1>
            <div className="flex">
                <Table
                    className="w-full md:w-1/3"
                    loading={loading}
                    data={feeds}
                    page={page}
                    refresh={fetchFeed}
                    onPageChange={(page) => setPage(prevState => ({...prevState, current: page}))}
                    row={TableRow}
                    columns={tableConfig}
                />
            </div>
        </div>
    )
}

const TableRow: React.FC<RowProps<Feed>> = ({data: f}) => (
    <tr key={f.id}>
        <td className="border-b border-gray-200 text-sm leading-5 font-bold px-6 py-2">{f.id}</td>
        <td className="border-b border-gray-200 text-sm leading-5 font-medium px-6 py-2">{f.name}</td>
        <td className="border-b border-gray-200 text-sm leading-5 font-medium px-6 py-2">
            <AvatarList users={f.admins}/>
        </td>
        <td className="p-2 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 font-medium">
            <Link
                to={`/admin/feed/${f.id}`}
                className="text-md text-indigo-500 hover:text-indigo-300 focus:outline-none focus:underline"
            >
                <IconFA name="fa-edit" />
            </Link>
        </td>
    </tr>
)

export default FeedPanel;