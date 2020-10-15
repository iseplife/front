import React, {CSSProperties, useCallback, useEffect, useMemo, useState} from "react"
import {getAuthorsThumbnail} from "../../data/post"
import {Avatar, Select} from "antd"
import {useSelector} from "react-redux"
import {AppState} from "../../context/action"
import {Author} from "../../data/request.type"
import Loading from "./Loading"
import {UserOutlined} from "@ant-design/icons"

import "./AvatarPicker.css"
import {mediaPath} from "../../util"
import {AvatarSizes} from "../../constants/MediaSizes"


const {Option} = Select

interface AvatarPickerProps {
    defaultValue?: number
    callback: (id?: number) => void
    compact?: boolean
    className?: string
    clubOnly?: boolean
    placeholder?: string
    style?: CSSProperties
}

const AvatarPicker: React.FC<AvatarPickerProps> = ({defaultValue, callback, compact, clubOnly, className, placeholder, style}) => {
    const userThumb = useSelector((state: AppState) => state.user.picture)
    const value = useMemo(() => defaultValue ? defaultValue : clubOnly ? undefined : 0, [clubOnly, defaultValue])
    const [loading, setLoading] = useState<boolean>(true)
    const [publishers, setPublishers] = useState<Author[]>([])

    const handleChange = useCallback((v: number) => callback(v || undefined), [callback])

    /**
     * Call on first render to get all publishers thumbnails
     */
    useEffect(() => {
        setLoading(true)
        getAuthorsThumbnail(clubOnly).then(res => {
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
            defaultValue={value}
            optionLabelProp={compact ? "label" : "children"}
            dropdownClassName="w-48"
            onChange={handleChange}
            className={className}
            style={style}
        >
            {!clubOnly &&
                <Option key={0} value={0} label={<Avatar icon={<UserOutlined/>} src={mediaPath(userThumb, AvatarSizes.THUMBNAIL)} size="small"/>}>
                    <Avatar icon={<UserOutlined/>} src={mediaPath(userThumb, AvatarSizes.THUMBNAIL)} size="small"/> moi
                </Option>
            }
            {loading ?
                <Option value="loading" disabled> <Loading size="lg"/> </Option> :
                publishers.map((p, i) => (
                    <Option
                        key={i + 1}
                        value={p.id}
                        label={<Avatar icon={<UserOutlined/>} src={mediaPath(p.thumbnail, AvatarSizes.THUMBNAIL)} size="small"/>}
                    >
                        <Avatar icon={<UserOutlined/>} src={mediaPath(p.thumbnail, AvatarSizes.THUMBNAIL)} size="small"/> {p.name}
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