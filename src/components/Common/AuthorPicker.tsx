import React, {CSSProperties, useCallback, useContext, useEffect, useMemo} from "react"
import {Select} from "antd"
import {Author} from "../../data/request.type"
import "./AvatarPicker.css"
import {AvatarSizes} from "../../constants/MediaSizes"
import {AppContext, AppContextType} from "../../context/app/context"
import StudentAvatar from "../Student/StudentAvatar"
import {useTranslation} from "react-i18next"
import { AppActionType } from "../../context/app/action"

const {Option} = Select

export type AuthorPickerProps = {
    authors?: Author[]
    filter?: number[]
    callback: (author?: Author) => void
    compact?: boolean
    className?: string
    clubOnly?: boolean
    placeholder?: string
    style?: CSSProperties
    disabled?: boolean
}

const AuthorPicker: React.FC<AuthorPickerProps> = ({authors: givenAuthors, filter, callback, compact, clubOnly, disabled = false, ...props}) => {
    const [t] = useTranslation("common")
    const {state: {user: {picture}, authors, selectedPublisher}, dispatch} = useContext<AppContextType>(AppContext)

    const choices = useMemo(() => {
        return (givenAuthors ?? (filter ? authors.filter(author => filter.includes(author.id)) : authors))
    }, [givenAuthors, authors, filter])

    const handleChange = useCallback((v: number) => {
        callback(choices.find(author => author.id == v))
        if(!clubOnly)
            dispatch({
                type: AppActionType.SET_SELECTED_PUBLISHER,
                selectedPublisher: choices.find(author => author.id == v),
            })
    }, 
    [callback, choices, dispatch, clubOnly])

    useEffect(() => {
        if(!clubOnly)
            callback(selectedPublisher)
    }, [clubOnly, selectedPublisher])

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
            defaultValue={clubOnly ? choices[0].id : selectedPublisher?.id ?? 0}
            optionLabelProp={compact ? "label" : "children"}
            dropdownClassName="w-48"
            onChange={handleChange}
            className={props.className}
            style={props.style}
            disabled={disabled}
            key={selectedPublisher?.id ?? 0}
        >
            {!clubOnly && selfAuthor}
            {choices.map((p, i) => (
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