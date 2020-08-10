import React, {useState} from "react"
import {Input, Select, Spin, Tag} from "antd"
import {useSelector} from "react-redux"
import {AppState} from "../../redux/types";

type Option = {
    label: string
    value: number
}

type FeedSelectorProps = {
    onChange: (ids: number[]) => void
}
const FeedSelector: React.FC<FeedSelectorProps> = ({onChange}) => {
    const feeds = useSelector((state: AppState) => state.feeds)
    const [values, setValues] = useState<number[]>()
    const [fetching, setFetching] = useState<boolean>(false)
    const [options, setOptions] = useState<Option[]>(feeds.map(f => ({
        value: f.id,
        label: f.name
    })))


    return (
        <Select
            mode="multiple"
            showSearch
            placeholder="Aucune audience (Evenement public) "
            value={values}
            showArrow={false}
            filterOption={false}
            notFoundContent={fetching ? <Spin size="small"/> : null}
            onChange={selected => {
                setValues(selected)
                setOptions(o => o.filter(i => selected.includes(i.value)))
                setFetching(false)
                onChange(selected)
            }}
            tagRender={props => <Tag closable={props.closable} onClose={props.onClose}>{props.label}</Tag>}
            options={options}
            bordered={false}
            className="w-full hover:border-indigo-400"
            style={{borderBottom: "1px solid #d9d9d9"}}
        />
    )
}

export default FeedSelector