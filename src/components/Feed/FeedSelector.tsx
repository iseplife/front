import React, {useMemo} from "react"
import {Select, Tag} from "antd"
import {useSelector} from "react-redux"
import {AppState} from "../../context/action"
import {CustomTagProps} from "rc-select/lib/interface/generator"

type Option = {
    label: string
    value: number
}

type FeedSelectorProps = {
    defaultValues?: number[]
    onChange: (ids: number[]) => void
    tagRender?: (props: CustomTagProps) => React.ReactElement
}
const FeedSelector: React.FC<FeedSelectorProps> = ({onChange, defaultValues, tagRender}) => {
    const feeds = useSelector((state: AppState) => state.feeds)
    const options = useMemo<Option[]>(() => Object.values(feeds).map(f => ({
        value: f.id,
        label: f.name
    })), [feeds])

    const tagComponent = useMemo(() => (
        tagRender && ((props: CustomTagProps) => <Tag closable={props.closable} onClose={props.onClose}>{props.label}</Tag>)
    ), [tagRender])

    return (
        <Select<number[]>
            mode="multiple"
            showSearch
            defaultValue={defaultValues}
            placeholder="Aucune audience (Evenement public) "
            showArrow={false}
            filterOption={(filter, option) => option ? (option as Option).label.includes(filter) : false }
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