import React, {CSSProperties, useCallback, useContext, useEffect, useMemo, useState} from "react"
import {getAuthorsThumbnail} from "../../data/post"
import {Select} from "antd"
import {Author} from "../../data/request.type"
import Loading from "./Loading"
import "./AvatarPicker.css"
import {AvatarSizes} from "../../constants/MediaSizes"
import {AppContext} from "../../context/app/context"
import StudentAvatar from "../Student/StudentAvatar"
import { useTranslation } from "react-i18next"


const {Option} = Select

interface AuthorPickerProps {
    defaultValue?: number
    callback: (author?: Author) => void
    compact?: boolean
    className?: string
    clubOnly?: boolean
    placeholder?: string
    style?: CSSProperties
}

const AuthorPicker: React.FC<AuthorPickerProps> = ({defaultValue, callback, compact, clubOnly, className, placeholder, style}) => {
    const {state: {user: {picture}}} = useContext(AppContext)
    const value = useMemo(() => defaultValue ? defaultValue : clubOnly ? undefined : 0, [clubOnly, defaultValue])
    const [loading, setLoading] = useState<boolean>(true)
    const [authors, setAuthors] = useState<Author[]>([])
    const [t] = useTranslation("common")

    const handleChange = useCallback((v: number) => callback(authors.find(author => author.id == v)), [callback])

    /**
     * Call on first render to get all publishers thumbnails
     */
    useEffect(() => {
        setLoading(true)
        getAuthorsThumbnail(clubOnly).then(res => {
            if (res.status === 200)
                setAuthors(res.data)
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
                <Option
                    key={0}
                    value={0}
                    label={<StudentAvatar id={0} name={t("me")} size="small" picture={picture} pictureSize={AvatarSizes.THUMBNAIL} />}
                >
                    <div className="flex items-center">
                        <StudentAvatar
                            id={0}
                            name={t("me")}
                            size="small"
                            picture={picture}
                            pictureSize={AvatarSizes.THUMBNAIL}
                        />
                        <label className="ml-2 text-black text-opacity-75 font-medium pointer-events-none">{t("me")}</label>
                    </div>
                </Option>
            }
            {loading ?
                <Option value="loading" disabled> <Loading size="lg"/> </Option> :
                authors.map((p, i) => (
                    <Option
                        key={i + 1}
                        value={p.id}
                        label={<StudentAvatar id={p.id} name={p.name} size="small" picture={p.thumbnail} pictureSize={AvatarSizes.THUMBNAIL} />}
                        className="flex"
                    >
                        <div className="flex items-center">
                            <StudentAvatar
                                id={p.id}
                                name={p.name}
                                size="small"
                                picture={p.thumbnail}
                                pictureSize={AvatarSizes.THUMBNAIL}
                            />
                            <div className="ml-2 text-black text-opacity-75 font-medium pointer-events-none">{p.name}</div >
                        </div>
                    </Option>
                ))
            }
        </Select>
    )
}

AuthorPicker.defaultProps = {
    className: "",
    compact: false
}

export default AuthorPicker