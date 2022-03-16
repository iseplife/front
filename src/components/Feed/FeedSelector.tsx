import React, {useEffect, useMemo, useState} from "react"
import {Select, Tag} from "antd"
import {CustomTagProps} from "rc-select/lib/interface/generator"
import {useTranslation} from "react-i18next"
import {getUserFeed} from "../../data/feed"

type OptionType = {
    value: number
    label: string
}

type FeedSelectorProps = {
    defaultValues?: number[]
    onChange: (ids: number[]) => void
    tagRender?: (props: CustomTagProps) => React.ReactElement
}
const FeedSelector: React.FC<FeedSelectorProps> = ({onChange, defaultValues, tagRender}) => {
    const {t} = useTranslation()
    const [options, setOptions] = useState<OptionType[]>([])

    const tagComponent = useMemo(() => (
        tagRender && ((props: CustomTagProps) => <Tag closable={props.closable} onClose={props.onClose}>{props.label}</Tag>)
    ), [tagRender])

    useEffect(() => {
        getUserFeed().then(res =>
            setOptions(res.data.map(feed => ({
                value: feed.id,
                label: feed.name
            })))
        )
    }, [])

    return (
        <Select<number[]>
            mode="multiple"
            showSearch
            defaultValue={defaultValues}
            placeholder={t("no_targets")}
            showArrow={false}
            filterOption={(filter, option) => option ?
                (option as OptionType).label.toLowerCase().includes(filter.toLowerCase()) :
                false
            }
            onChange={selected => onChange(selected)}
            tagRender={tagComponent}
            options={options}
            bordered={false}
            className="w-full hover:border-indigo-400"
            style={{borderBottom: "1px solid #d9d9d9"}}
        />
    )
}

export default FeedSelector