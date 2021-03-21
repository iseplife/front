import React, {CSSProperties, useCallback, useState} from "react"
import {Select, Spin, Tag} from "antd"
import {searchAllStudents} from "../../data/student"
import {StudentPreview} from "../../data/student/types"
import {AvatarSizes} from "../../constants/MediaSizes"
import StudentAvatar from "./StudentAvatar"

const TRIGGER_LENGTH = 2
type Option = {
    label: JSX.Element
    value: number
}


type StudentSelectorProps = {
    onChange: (id: number[]) => void
    defaultValues?: StudentPreview[]
    className?: string
    placeholder?: string
    style?: CSSProperties
}
const StudentSelector: React.FC<StudentSelectorProps> = ({onChange, defaultValues = [], className = "", style, placeholder= "N/A"}) => {
    const [values, setValues] = useState<number[]>(defaultValues.map(v => v.id))
    const [options, setOptions] = useState<Option[]>(defaultValues.map(v => ({
        value: v.id,
        label: (
            <>
                <StudentAvatar
                    id={v.id}
                    name={v.firstName + " " + v.lastName}
                    size={18}
                    picture={v.picture}
                    pictureSize={AvatarSizes.THUMBNAIL}
                    className="mr-2 my-1 box-border"
                />
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
                                <StudentAvatar
                                    id={o.id}
                                    name={o.name}
                                    picture={o.thumbURL}
                                    pictureSize={AvatarSizes.THUMBNAIL}
                                    className="mr-2 my-1 box-border"
                                />
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
            placeholder={placeholder}
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
            tagRender={props => <Tag closable={props.closable} onClose={props.onClose} className="rounded-full my-1 flex items-center">{props.label}</Tag>}
            options={options}
            className={`${className}`}
            style={style}
        />
    )
}

export default StudentSelector