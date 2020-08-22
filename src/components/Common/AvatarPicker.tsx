import React, {CSSProperties, useEffect, useState} from "react"
import {getPublishersThumbnail} from "../../data/post"
import {Avatar, Select} from "antd"
import {useSelector} from "react-redux"
import {AppState} from "../../context/action"
import {Author} from "../../data/request.type"
import Loading from "./Loading"
import {UserOutlined} from "@ant-design/icons"

import "./AvatarPicker.css"


const {Option} = Select

interface AvatarPickerProps {
    callback: (id?: number) => void
    compact?: boolean
    className?: string
    clubOnly?: boolean
    placeholder?: string
    style?: CSSProperties
}

const AvatarPicker: React.FC<AvatarPickerProps> = ({callback, compact, clubOnly, className, placeholder, style}) => {
    const userThumb = useSelector((state: AppState) => state.user.picture)
    const [loading, setLoading] = useState<boolean>(true)
    const [publishers, setPublishers] = useState<Author[]>([])

    /**
     * Call on first render to get all publishers thumbnails
     */
    useEffect(() => {
        setLoading(true)
        getPublishersThumbnail(clubOnly).then(res => {
            if (res.status === 200)
                setPublishers(res.data)
        }).finally(() => setLoading(false))
    }, [clubOnly])


    //TODO: when migrate to ant.d v4 remove css and use borderless props
    return (
        <Select
            id="avatar-select"
            placeholder={placeholder}
            bordered={false}
            showArrow={false}
            optionLabelProp={compact ? "label" : "children"}
            defaultValue={clubOnly ? undefined : 0}
            dropdownClassName="w-auto"
            onChange={(value: number) => callback(value || undefined)}
            className={className}
            style={style}
        >
            {!clubOnly &&
            <Option value={0} label={<Avatar icon={<UserOutlined/>} src={userThumb} size="small"/>}>
                <Avatar icon={<UserOutlined/>} src={userThumb} size="small"/> moi
            </Option>
            }
            {loading ?
                <Option value="loading" disabled> <Loading size="lg"/> </Option> :
                publishers.map((p, i) => (
                    <Option
                        key={i}
                        value={p.id}
                        label={<Avatar icon={<UserOutlined/>} src={p.thumbnail} size="small"/>}
                    >
                        <Avatar icon={<UserOutlined/>} src={p.thumbnail} size="small"/> {p.name}
                    </Option>
                ))
            }
        </Select>
    )
}

AvatarPicker.defaultProps = {
    className: "",
    compact: false
}

export default AvatarPicker