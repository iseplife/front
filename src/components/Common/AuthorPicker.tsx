import React, {CSSProperties, useCallback, useContext, useMemo} from "react"
import {Select} from "antd"
import {Author} from "../../data/request.type"
import "./AvatarPicker.css"
import {AvatarSizes} from "../../constants/MediaSizes"
import {AppContext} from "../../context/app/context"
import StudentAvatar from "../Student/StudentAvatar"
import {useTranslation} from "react-i18next"

const {Option} = Select

export type AuthorPickerProps = {
    defaultValue?: number
    authors: Author[]
    callback: (author?: Author) => void
    compact?: boolean
    className?: string
    clubOnly?: boolean
    placeholder?: string
    style?: CSSProperties
}

const AuthorPicker: React.FC<AuthorPickerProps> = ({authors, defaultValue, callback, compact, clubOnly, ...props}) => {
    const {state: {user: {picture}}} = useContext(AppContext)
    const value = useMemo(() => defaultValue ? defaultValue : clubOnly ? undefined : 0, [clubOnly, defaultValue])
    const [t] = useTranslation("common")

    const handleChange = useCallback((v: number) => (
        callback(authors.find(author => author.id == v))
    ), [callback, authors])

    const selfAuthor = useMemo(() => (
        <Option
            key={0}
            value={0}
            label={
                <StudentAvatar
                    id={0} name={t("me")} size="small"
                    picture={picture} pictureSize={AvatarSizes.THUMBNAIL}
                />
            }
        >
            <div className="flex items-center">
                <StudentAvatar
                    id={0} name={t("me")} size="small"
                    picture={picture} pictureSize={AvatarSizes.THUMBNAIL}
                />
                <label
                    className="ml-2 text-black text-opacity-75 font-medium pointer-events-none">{t("me")}</label>
            </div>
        </Option>
    ), [picture])


    //TODO: when migrate to ant.d v4 remove css and use borderless props
    return (
        <Select
            id="avatar-select"
            placeholder={props.placeholder}
            bordered={false}
            showArrow={false}
            defaultValue={value}
            optionLabelProp={compact ? "label" : "children"}
            dropdownClassName="w-48"
            onChange={handleChange}
            className={props.className}
            style={props.style}
        >
            {!clubOnly && selfAuthor}
            {authors.map((p, i) => (
                <Option
                    key={i + 1}
                    value={p.id}
                    label={
                        <StudentAvatar
                            id={p.id} name={p.name} size="small"
                            picture={p.thumbnail} pictureSize={AvatarSizes.THUMBNAIL}
                        />
                    }
                    className="flex"
                >
                    <div className="flex items-center">
                        <StudentAvatar
                            id={p.id} name={p.name} size="small"
                            picture={p.thumbnail} pictureSize={AvatarSizes.THUMBNAIL}
                        />
                        <div className="ml-2 text-black text-opacity-75 font-medium pointer-events-none">
                            {p.name}
                        </div>
                    </div>
                </Option>
            ))}
        </Select>
    )
}

AuthorPicker.defaultProps = {
    className: "",
    compact: false
}

export default AuthorPicker