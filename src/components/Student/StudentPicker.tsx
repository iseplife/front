import React, {useCallback, useState} from "react"
import {Avatar, Select, Spin, Tag} from "antd"
import {searchAllStudents} from "../../data/student"
import {UserOutlined} from "@ant-design/icons"

const TRIGGER_LENGTH = 2
type Option = {
    label: JSX.Element
    value: number
}


type StudentPickerProps = {
    onChange: (id: number) => void
    className?: string
}
const StudentPicker: React.FC<StudentPickerProps> = ({onChange, className}) => {
    const [value, setValue] = useState<number>()
    const [options, setOptions] = useState<Option[]>()
    const [fetching, setFetching] = useState<boolean>(false)

    const handleSearch = useCallback((value: string) => {
        if (value.length > TRIGGER_LENGTH) {
            setFetching(true)
            searchAllStudents(value).then(res => {
                if (res.status === 200) {
                    setOptions(res.data.map(o => ({
                        value: o.id,
                        label: (
                            <>
                                <Avatar icon={<UserOutlined/>} src={o.thumbURL} size={18} className="mr-2 my-1 box-border"/>
                                {o.name}
                            </>
                        )
                    })))
                }
            }).finally(() => setFetching(false))
        } else {
            setOptions([])
        }
    }, [])

    return (
        <Select
            showSearch
            placeholder="Search for a student"
            value={value}
            showArrow={false}
            filterOption={false}
            notFoundContent={fetching ? <Spin size="small"/> : null}
            onSearch={handleSearch}
            onChange={selected => {
                setValue(selected)
                setFetching(false)
                onChange(selected)
            }}
            tagRender={props => <Tag closable={props.closable} onClose={props.onClose}>{props.label}</Tag>}
            options={options}
            className={className}
        />
    )
}
StudentPicker.defaultProps = {
    className: ""
}

export default StudentPicker