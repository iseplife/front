import {Divider, Empty, Select} from "antd"
import React, {useCallback, useEffect, useState} from "react"
import {globalSearch, searchClub, searchEvent, searchStudent} from "../../data/searchbar"
import {useHistory} from "react-router-dom"
import {SearchItem, SearchItemType} from "../../data/searchbar/types"
import {useTranslation} from "react-i18next"
import CustomCheckbox from "./CustomCheckbox"
import AvatarSearchType from "./AvatarSearchType"
import Pills from "../Common/Pills"
import "./SearchBar.css"

const {Option} = Select
const SEARCH_LENGTH_TRIGGER = 2

export interface SelectInputProps {
    id?: number
    type?: string
    text: string
    value: string
    thumbURL: string
    status: boolean
}

interface SearchBarProps {
    searchType?: SearchItemType
}

const SearchBar: React.FC<SearchBarProps> = (searchType) => {
    const {t} = useTranslation("search")
    const history = useHistory()
    const [data, setData] = useState<SelectInputProps[]>([])
    const [currentValue, setCurrentValue] = useState<string>("")
    const [fetching, setFetching] = useState<boolean>(false)

    const [filterStudent, setFilterStudent] = useState<boolean>(true)
    const [filterEvent, setFilterEvent] = useState<boolean>(true)
    const [filterClub, setFilterClub] = useState<boolean>(true)
    const [filterOn, setFilterOn] = useState<boolean>(false)

    useEffect(() => {
        setFilterOn(searchType.searchType === SearchItemType.ALL)
    }, [searchType.searchType])

    /**
     * Call to search in API
     * @param queryParams
     */
    const updateSearchItems = (queryParams: string) => {
        setFetching(true)
        switch (searchType.searchType) {
            case SearchItemType.STUDENT:
                searchStudent(queryParams, "", 0).then(res => {
                    const searchItems: SearchItem[] = res.data.content
                    setData(searchItems.map((searchItem: SearchItem) => ({
                        id: searchItem.id,
                        type: searchItem.type,
                        value: searchItem.name,
                        text: searchItem.name,
                        thumbURL: searchItem.thumbURL,
                        status: searchItem.status
                    })))
                }).finally(() => setFetching(false))
                break
            case SearchItemType.EVENT:
                searchEvent(queryParams, 0).then(res => {
                    const searchItems: SearchItem[] = res.data.content
                    setData(searchItems.map((searchItem: SearchItem) => ({
                        id: searchItem.id,
                        type: searchItem.type,
                        value: searchItem.name,
                        text: searchItem.name,
                        thumbURL: searchItem.thumbURL,
                        status: searchItem.status
                    })))
                }).finally(() => setFetching(false))
                break
            case SearchItemType.CLUB:
                searchClub(queryParams, 0).then(res => {
                    const searchItems: SearchItem[] = res.data.content
                    setData(searchItems.map((searchItem: SearchItem) => ({
                        id: searchItem.id,
                        type: searchItem.type,
                        value: searchItem.name,
                        text: searchItem.name,
                        thumbURL: searchItem.thumbURL,
                        status: searchItem.status
                    })))
                }).finally(() => setFetching(false))
                break
            case SearchItemType.ALL:
            default:
                globalSearch(queryParams, 0).then(res => {
                    const searchItems: SearchItem[] = res.data.content
                    setData(searchItems.map((searchItem: SearchItem) => ({
                        id: searchItem.id,
                        type: searchItem.type,
                        value: searchItem.name,
                        text: searchItem.name,
                        thumbURL: searchItem.thumbURL,
                        status: searchItem.status
                    })))
                }).finally(() => setFetching(false))
                break
        }
    }

    /**
     * Fires when input change
     * @param value
     */
    const handleSearch = useCallback((value: string) => {
        setCurrentValue(value)
        if (!!value && value.length > SEARCH_LENGTH_TRIGGER && currentValue !== value) {
            updateSearchItems(value)
        } else {
            setData([])
        }
    }, [currentValue])

    /**
     * Fires when item is selected
     */
    const handleSelect = useCallback((value: string) => {
        setCurrentValue("")
        history.push("/" + value)
    }, [])


    const renderOptions = () => {
        return data.map((inputProps: SelectInputProps) => {
            return ((inputProps.type === SearchItemType.STUDENT && filterStudent) || (inputProps.type === SearchItemType.EVENT && filterEvent) || (inputProps.type === SearchItemType.CLUB && filterClub)) &&
                <Option key={inputProps.value} value={`${inputProps.type?.toLowerCase()}/${inputProps.id}`}>
                    <div className="flex justify-between">
                        <div className="inline-flex">
                            <AvatarSearchType props={inputProps}/>
                            <div className="ml-2 font-bold">{inputProps.text}</div>
                        </div>
                        <Pills status={inputProps.status} event={inputProps.type === SearchItemType.EVENT} style={{fontSize: ".65rem"}}/>
                    </div>
                </Option>
        })
    }

    const customDropdownRender = (menu: React.ReactNode) => {
        return (
            filterOn
                ? <>
                    <div className="inline-flex flex-no-wrap p-2 mx-auto items-center">
                        <CustomCheckbox title={t("student")} filterStatus={filterStudent}
                            onChange={(e) => setFilterStudent(e.target.checked)}/>
                        <CustomCheckbox title={t("club")} filterStatus={filterClub}
                            onChange={(e) => setFilterClub(e.target.checked)}/>
                        <CustomCheckbox title={t("event")} filterStatus={filterEvent}
                            onChange={(e) => setFilterEvent(e.target.checked)}/>
                    </div>
                    <Divider className="my-1"/>
                    {menu}
                </>
                :
                <>
                    {menu}
                </>
        )
    }

    return (
        <Select
            showSearch
            showArrow={false}
            filterOption={false}
            defaultActiveFirstOption={false}
            value={currentValue ? currentValue : undefined}
            loading={fetching}
            placeholder={t("placeholder")}
            className="search-bar my-auto w-4/5 md:w-3/5 lg:w-5/12 xl:w-2/5 rounded-full"
            notFoundContent={
                <Empty
                    className="flex flex-col items-center"
                    image={"/img/meme-face.png"}
                    description={t("funny_empty_message")}
                />
            }
            onSearch={handleSearch}
            onSelect={handleSelect}
            dropdownRender={menu => customDropdownRender(menu)}
        >
            {renderOptions()}
        </Select>
    )
}

SearchBar.defaultProps = {
    searchType: SearchItemType.ALL
}

export default SearchBar