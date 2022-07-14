import React, {useCallback, useState} from "react"
import {Select, Spin, Tag} from "antd"
import {searchAllStudents} from "../../data/student"
import {AvatarSizes} from "../../constants/MediaSizes"
import {mediaPath} from "../../util"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faUser} from "@fortawesome/free-regular-svg-icons"
import {SearchItem} from "../../data/searchbar/types"
import {useTranslation} from "react-i18next"
import { WebPAvatarPolyfill } from "../Common/WebPPolyfill"

const TRIGGER_LENGTH = 2
type Option = {
    label: JSX.Element
    value: number
}

export type SelectRef = {blur: ()=>void, focus: ()=>void}

type StudentPickerProps = {
    onChange: (id: number, metadata: SearchItem) => void
    placeholder?: string
    multiple?: boolean
    className?: string
    selectRef?: React.Ref<SelectRef>
    noSelect?: boolean
}
const StudentPicker: React.FC<StudentPickerProps> = ({onChange, multiple = false, selectRef, noSelect, className, placeholder}) => {
    const {t} = useTranslation("search")
    const [value, setValue] = useState<number>()
    const [options, setOptions] = useState<Option[]>([])
    const [fetching, setFetching] = useState<boolean>(false)
    const [metadata, setMetadata] = useState<Map<number, SearchItem>>(new Map())

    const handleSearch = useCallback((value: string) => {
        if (value.length > TRIGGER_LENGTH) {
            setFetching(true)
            searchAllStudents(value).then(res => {
                if (res.status === 200) {
                    setMetadata(mt => {
                        mt.clear()
                        res.data.forEach(item => mt.set(item.id, item))
                        return mt
                    })
                    setOptions(res.data.map(o => ({
                        value: o.id,
                        label: (
                            <span className="truncate flex flex-row items-center">
                                <WebPAvatarPolyfill
                                    src={mediaPath(o.thumbURL, AvatarSizes.THUMBNAIL)}
                                    icon={<FontAwesomeIcon icon={faUser} />}
                                    alt={o.name}
                                    size={18}
                                    className="hover:shadow-outline mr-2"
                                />
                                {o.name}
                            </span>
                        )
                    })))
                }
            }).finally(() => setFetching(false))
        } else {
            setOptions([])
            setMetadata(i => {
                i.clear()
                return i
            })
        }
    }, [])


    return (
        <Select
            placeholder={placeholder ?? t("search_student")}
            mode={multiple ? "multiple": undefined}
            allowClear={!multiple && !noSelect}
            showSearch
            value={value}
            showArrow={false}
            filterOption={false}
            autoClearSearchValue={false}
            loading={fetching}
            ref={selectRef}
            notFoundContent={fetching ? <Spin size="small"/> : null}
            onSearch={handleSearch}
            onChange={selected => {
                setValue(noSelect ? null! : selected)
                setFetching(false)
                onChange(selected, metadata.get(selected) as SearchItem)
            }}
            tagRender={props => <Tag className="overflow-hidden" closable={props.closable} onClose={props.onClose}>{props.label}</Tag>}
            className={className}
            options={options}
        />
    )
}
StudentPicker.defaultProps = {
    className: ""
}

export default StudentPicker