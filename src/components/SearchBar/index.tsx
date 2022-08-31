import {Divider, Empty, Select} from "antd"
import React, {useCallback, useEffect, useState} from "react"
import {globalSearch, searchClub, searchEvent, searchStudent} from "../../data/searchbar"
import {Link, useHistory} from "react-router-dom"
import {SearchItem, SearchItemType} from "../../data/searchbar/types"
import {useTranslation} from "react-i18next"
import CustomCheckbox from "./CustomCheckbox"
import "./SearchBar.css"
import AvatarSearchType from "./AvatarSearchType"
import Pills from "../Common/Pills"
import Loading from "../Common/Loading"
import Axios, {CancelTokenSource} from "axios"
import {handleRequestCancellation} from "../../util"
import LinkEntityPreloader from "../Optimization/LinkEntityPreloader"

const SEARCH_LENGTH_TRIGGER = 2
const {Option} = Select

type FilterType = Record<Exclude<SearchItemType, SearchItemType.ALL>, boolean>
const DEFAULT_FILTER: FilterType = {
    [SearchItemType.CLUB]: true,
    [SearchItemType.GROUP]: true,
    [SearchItemType.EVENT]: true,
    [SearchItemType.STUDENT]: true,
}

type SearchBarProps = {
    searchType?: SearchItemType
}
const SearchBar: React.FC<SearchBarProps> = ({searchType}) => {
    const {t} = useTranslation("search")
    const history = useHistory()
    const [data, setData] = useState<SearchItem[]>([])
    const [currentValue, setCurrentValue] = useState<string>("")
    const [fetching, setFetching] = useState<boolean>(false)

    const [filter, setFilter] = useState<FilterType>(DEFAULT_FILTER)
    const [source, setSource] = useState<CancelTokenSource>()


    const updateFilter = useCallback((type: SearchItemType, state: boolean) => {
        setFilter(f => ({...f, [type]: state}))
    }, [])


    /**
     * Fires when item is selected
     */
    const handleSelect = useCallback((value: string) => {
        setCurrentValue("")
    }, [])

    /**
     * Call to search in API
     * @param queryParams
     */
    useEffect(() => {
        if (currentValue.length > SEARCH_LENGTH_TRIGGER) {
            // We cancel the previous request to avoid any memory leaking
            if (source)
                source.cancel("Operation canceled due to new request.")

            const tokenSource = Axios.CancelToken.source()
            setSource(tokenSource)
            setFetching(true)
            switch (searchType) {
                case SearchItemType.STUDENT:
                    searchStudent(currentValue, "", 0, tokenSource.token)
                        .then(res => {
                            setData(res.data.content)
                        })
                        .catch(handleRequestCancellation)
                        .finally(() => setFetching(false))
                    break
                case SearchItemType.EVENT:
                    searchEvent(currentValue, 0, tokenSource.token)
                        .then(res => {
                            setData(res.data.content)
                        })
                        .catch(handleRequestCancellation)
                        .finally(() => setFetching(false))
                    break
                case SearchItemType.CLUB:
                    searchClub(currentValue, 0, tokenSource.token)
                        .then(res => {
                            setData(res.data.content)
                        })
                        .catch(handleRequestCancellation)
                        .finally(() => setFetching(false))
                    break
                case SearchItemType.ALL:
                default:
                    globalSearch(currentValue, 0, tokenSource.token)
                        .then(res => {
                            if (res.data)
                                setData(res.data.content)
                        })
                        .catch(handleRequestCancellation)
                        .finally(() => setFetching(false))
                    break
            }

        } else {
            setData([])
        }

        return () => {
            if (source) source.cancel("Operation canceled due to an unmounting component.")
        }
    }, [currentValue, searchType])


    const customDropdownRender = (menu: React.ReactNode) => {
        return (
            searchType === SearchItemType.ALL ?
                <>
                    <div className="inline-flex flex-no-wrap p-2 mx-auto items-center hidden-scroller w-full overflow-x-auto">
                        <CustomCheckbox
                            title={t("student")}
                            filterStatus={filter[SearchItemType.STUDENT]}
                            onChange={(e) => updateFilter(SearchItemType.STUDENT, e.target.checked)}
                        />
                        <CustomCheckbox
                            title={t("club")}
                            filterStatus={filter[SearchItemType.CLUB]}
                            onChange={(e) => updateFilter(SearchItemType.CLUB, e.target.checked)}
                        />
                        <CustomCheckbox
                            title={t("event")}
                            filterStatus={filter[SearchItemType.EVENT]}
                            onChange={(e) => updateFilter(SearchItemType.EVENT, e.target.checked)}
                        />
                        <CustomCheckbox
                            title={t("group")}
                            filterStatus={filter[SearchItemType.GROUP]}
                            onChange={(e) => updateFilter(SearchItemType.GROUP, e.target.checked)}
                        />
                    </div>
                    <Divider className="my-1"/>
                    {menu}
                </>
                : <>{menu}</>
        )
    }

    return (
        <Select
            showSearch
            showArrow={false}
            filterOption={false}
            defaultActiveFirstOption={false}
            value={currentValue ? currentValue : undefined}
            placeholder={t("placeholder")}
            className="search-bar my-auto w-4/5 md:w-3/5 lg:w-5/12 xl:w-2/5"
            notFoundContent={
                fetching ?
                    <div>
                        <Loading size="3x"/>
                    </div> :
                    <Empty
                        className="flex flex-col items-center"
                        image={"/img/meme-face.png"}
                        description={t("funny_empty_message")}
                    />
            }
            onSearch={setCurrentValue}
            onSelect={handleSelect}
            dropdownRender={(menu: React.ReactNode) => customDropdownRender(menu)}
        >
            {data.map((item) => filter[item.type] &&
                <Option key={`${item.type}-${item.id}`} value={`${item.type.toLowerCase()}/${item.id}`}>
                    <LinkEntityPreloader preview={item}>
                        <Link to={`/${item.type.toLowerCase()}/${item.id}`} className="text-[color:inherit]">
                            <div className="flex justify-between">
                                <div className="inline-flex">
                                    <AvatarSearchType
                                        type={item.type}
                                        text={item.name}
                                        thumbURL={item.thumbURL}
                                    />
                                    <div className="ml-2 font-bold">{item.name}</div>
                                </div>
                                <Pills status={item.status} event={item.type === SearchItemType.EVENT} style={{fontSize: ".65rem"}}/>
                            </div>
                        </Link>
                    </LinkEntityPreloader>
                </Option>
            )}
        </Select>
    )
}

SearchBar.defaultProps = {
    searchType: SearchItemType.ALL
}

export default SearchBar
