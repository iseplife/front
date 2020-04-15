import React from "react";
import {StudentPreviewAdmin} from "../../data/student/types";
import {getEducationYear} from "../../util";
import {Avatar, Pagination} from "antd";
import {Link} from "react-router-dom";
import Loading from "../Common/Loading";
import {PageStatus} from "../../pages/admin/student";

type StudentTableProps = {
    page: PageStatus
    students: StudentPreviewAdmin[]
    loading: boolean
    onPageChange: (page: number) => void
}

const TableHeader: React.FC = ({children}) => (
    <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
        {children}
    </th>
);


const StudentsTable: React.FC<StudentTableProps> = ({page, students, loading, onPageChange}) => {
    return (
        <div className="w-full md:w-2/3 mx-2">
            <div>

            </div>
            <div className="flex flex-col items-center justify-between w-full shadow sm:rounded-lg border-b"
                 style={{minHeight: "16rem"}}>
                {loading ?
                    <div className="flex flex-1 w-full"><Loading size="4x" className="m-auto"/></div> :
                    <table className="table-fixed w-full">
                        <colgroup>
                            <col style={{minWidth: "20rem"}}/>
                            <col className="w-32"/>
                            <col className="w-32"/>
                            <col className=""/>
                            <col className="w-24"/>
                        </colgroup>
                        <thead>
                        <tr>
                            <TableHeader>Nom</TableHeader>
                            <TableHeader>Promotion</TableHeader>
                            <TableHeader>Actif</TableHeader>
                            <TableHeader>Role(s)</TableHeader>
                            <TableHeader />
                        </tr>
                        </thead>
                        <tbody className="bg-white">
                        {students.map(s => (
                            <tr key={s.id}>
                                <td className="px-6 py-2 whitespace-no-wrap border-b border-gray-200">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10">
                                            <Avatar icon="user" src={s.picture}/>
                                        </div>
                                        <div className="ml-4 overflow-hidden">
                                            <Link to={`/admin/user/${s.id}`}>
                                                <div
                                                    className="text-sm leading-5 font-medium text-gray-900 hover:text-indigo-400 focus:outline-none focus:underline break-words"
                                                    title={s.lastName.toUpperCase() + ' ' + s.firstName}
                                                >
                                                    {s.lastName.toUpperCase() + ' ' + s.firstName}
                                                </div>
                                            </Link>
                                            <div className="text-sm leading-5 text-gray-500">n° {s.id}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-2 whitespace-no-wrap border-b border-gray-200">
                                    <div className="text-sm leading-5 text-gray-900">
                                        {getEducationYear(s.promo)}
                                    </div>
                                    <div className="text-sm leading-5 text-gray-500">promo {s.promo}</div>
                                </td>
                                <td className="px-6 py-2 whitespace-no-wrap border-b border-gray-200">
                                    {s.archived ?
                                        <span
                                            className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                            Archivé
                                         </span> :
                                        <span
                                            className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                            Actif
                                        </span>
                                    }

                                </td>
                                <td className=" px-6 py-2 whitespace-no-wrap border-b border-gray-200 text-xs leading-5">
                                    <div className="flex flex-wrap">
                                        {s.roles.map((r, index) => (
                                            <span key={index} className="rounded bg-indigo-300 text-white m-1 p-1">
                                            {r.substr(5).replace(/_/g, ' ')}
                                        </span>
                                        ))}
                                    </div>
                                </td>
                                <td className="px-6 py-2 whitespace-no-wrap text-right border-b border-gray-200 text-sm leading-5 font-medium">
                                    <Link
                                        to={`/admin/user/${s.id}`}
                                        className="text-indigo-600 hover:text-indigo-900 focus:outline-none focus:underline"
                                    >
                                        Edit
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                }
                {(page.total || 1) > 1 &&
                    <Pagination
                        className="text-center my-3" 
                        onChange={onPageChange}
                        defaultCurrent={page.current + 1}
                        pageSize={page.size}
                        total={page.total}
                    />
                }
            </div>
        </div>
    )
};

export default StudentsTable;