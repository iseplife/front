import React, {useCallback, useContext, useMemo, useState} from "react"
import {Select} from "antd"
import Tag from "../Common/Tag"
import {useRecoilState} from "recoil"
import {filterState} from "../../pages/default/calendar"
import {useTranslation} from "react-i18next"
import {CalendarContext} from "../../context/calendar/context"
import {faTimes} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"

const {Option} = Select

//TODO: rework how filter is handle, it's overcomplicated.
const FeedFilter: React.FC = () => {
    const {t} = useTranslation("event")
    const [value, setValue] = useState<number>()
    const {feeds} = useContext(CalendarContext)
    const [filter, setFilter] = useRecoilState(filterState)

    const toggleFeed = useCallback((id: number) => setFilter(f => ({
        ...f,
        feeds: {
            ...f.feeds,
            [id]: !f.feeds[id]
        }
    })), [])

    const selectedFeeds = useMemo(() => {
        return (
            Object.entries(filter.feeds).map(([k, v]) => v && (
                <Tag key={k} selected={true} onClick={() => toggleFeed(+k)}>
                    {feeds[+k]} <FontAwesomeIcon icon={faTimes} className="hover:text-red-500"/>
                </Tag>
            ))
        )
    }, [feeds, filter.feeds, toggleFeed])

    const selectCallback = useCallback((id: number) => 
        toggleFeed(id)
    , [toggleFeed])

    return (
        <div id="feeds-filter">
            <Select<number>
                showSearch
                value={value}
                placeholder={t("feed_filter")}
                showArrow={false}
                filterOption={(filter, option) => option ?
                    !!option.children?.toLocaleString().toLowerCase().includes(filter.toLowerCase()) :
                    false
                }
                onSelect={selectCallback}
                className="rounded-scroller w-full hover:border-[#fe9200]"
            >
                {Object.entries(feeds).map(([id, name])=> (
                    <Option key={id} value={id} disabled={filter.feeds[+id]}>
                        {name}
                    </Option>
                ))}
            </Select>

            <div className="my-2 flex flex-wrap justify-center">
                {selectedFeeds.length === 0 ?
                    <Tag selected={true} onClick={undefined}>
                        Tous les feeds sont visibles
                    </Tag> :
                    selectedFeeds
                }
            </div>
        </div>
    )
}

export default FeedFilter
