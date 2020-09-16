import React, {useCallback, useState} from "react"
import {Avatar, Select, Spin, Tag} from "antd"
import {searchAllStudents} from "../../data/student"
import {StudentPreview} from "../../data/student/types"
import {UserOutlined} from "@ant-design/icons"
import {mediaPath} from "../../util"
import {AvatarSizes} from "../../constants/MediaSizes";

const TRIGGER_LENGTH = 2
type Option = {
    label: JSX.Element
    value: number
}


type StudentSelectorProps = {
    onChange: (id: number[]) => void
    defaultValues?: StudentPreview[]
}
const StudentSelector: React.FC<StudentSelectorProps> = ({onChange, defaultValues = []}) => {
    const [values, setValues] = useState<number[]>(defaultValues.map(v => v.id))
    const [options, setOptions] = useState<Option[]>(defaultValues.map(v => ({
        value: v.id,
        label: (
            <>
                <Avatar icon={<UserOutlined/>} src={mediaPath(v.picture, AvatarSizes.THUMBNAIL)} size={18} className="mr-2 my-1 box-border"/>
                {v.firstName + " " + v.lastName}
            </>
        )
    })))
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
                                <Avatar icon={<UserOutlined/>} src={mediaPath(o.thumbURL, AvatarSizes.THUMBNAIL)} size={18} className="mr-2 my-1 box-border"/>
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
            mode="multiple"
            showSearch
            placeholder="Aucun administrateur (déconseillé) "
            value={values}
            showArrow={false}
            filterOption={false}
            notFoundContent={fetching ? <Spin size="small"/> : null}
            onSearch={handleSearch}
            onChange={selected => {
                setValues(selected)
                setOptions(o => o.filter(i => selected.includes(i.value)))
                setFetching(false)
                onChange(selected)
            }}
            tagRender={props => <Tag closable={props.closable} onClose={props.onClose}>{props.label}</Tag>}
            options={options}
            className="w-full "

        />
    )
}

export default StudentSelector