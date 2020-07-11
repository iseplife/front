import React, {CSSProperties, useMemo} from "react"
import {Pagination} from "antd"
import Loading from "../Common/Loading"
import {PageStatus} from "../../pages/admin/student"

type ColumnComponent<T> = React.FC<TableProps<T>>
interface Column {
    title: string,
    className?: string
}
export type ColumnType<T> = (Column | ColumnComponent<T>)

export type TableProps<T> = {
    className?: string
    style?: CSSProperties
    page: PageStatus
    refresh?: () => void
    data: T[]
    loading: boolean
    onPageChange: (page: number) => void
    columns: ColumnType<T>[]
    row: React.FC<RowProps<T>>
}

export interface RowProps<D> {
    data: D
}


const TableHeader: React.FC<{ className?: string }> = ({className = "", children}) => (
	<th className={`${className} px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider`}>
		{children}
	</th>
)

const Table = <T, >(props: TableProps<T>) => {
	const {row: CustomRow} = props
	const Headers = useMemo(() => (
		<>
			{props.columns.map((c, i) =>
				(typeof c === "function") ?
					<th className="" key={i}>
						{(c as ColumnComponent<T>)(props)}
					</th>:
					<TableHeader key={i} className={(c as Column).className}>
						{(c as Column).title}
					</TableHeader>
			)}
		</>
	), [props.columns])

	return (
		<div className={`${props.className || ""} mx-2`} style={props.style}>
			<div>

			</div>
			<div className="flex flex-col items-center justify-between w-full shadow sm:rounded-lg border-b bg-white"
				style={{minHeight: "16rem"}}>
				{props.loading ?
					<div className="flex flex-1 w-full"><Loading size="4x" className="m-auto"/></div> :
					<table className="table-fixed w-full">
						<thead className="bg-gray-100">
							<tr>
								{Headers}
							</tr>
						</thead>
						<tbody className="bg-white">
							{props.data.map((d,i) => (
								<CustomRow key={i} data={d}/>
							))}
						</tbody>
					</table>
				}
				{(props.page.total || 1) > 1 &&
                <Pagination
                	className="text-center my-3"
                	onChange={props.onPageChange}
                	defaultCurrent={props.page.current + 1}
                	pageSize={props.page.size}
                	total={props.page.total}
                />
				}
			</div>
		</div>
	)
}


export default Table
