import {Divider, RefSelectProps, Select} from "antd"
import Axios, {CancelTokenSource} from "axios"
import React, {useCallback, useEffect, useMemo, useRef, useState} from "react"
import {useTranslation} from "react-i18next"
import {Link, useHistory} from "react-router-dom"
import {AvatarSizes} from "../../constants/MediaSizes"
import {globalSearch, searchClub, searchEvent, searchStudent} from "../../data/searchbar"
import {SearchItem, SearchItemType} from "../../data/searchbar/types"
import {_format, getTakeoverClubLogo, handleRequestCancellation, mediaPath} from "../../util"
import {WebPAvatarPolyfill} from "../Common/WebPPolyfill"
import LinkEntityPreloader from "../Optimization/LinkEntityPreloader"
import AvatarSearchType from "./AvatarSearchType"
import CustomCheckbox from "./CustomCheckbox"
import "./SearchBar.css"
import {ClubPreview} from "../../data/club/types"

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

    const lastFirstSeptember = useMemo(() => {
        const today = new Date()
        const anneeCourante = today.getFullYear()
        const premierSeptembre = new Date(anneeCourante, 8, 1)
    
        if (today < premierSeptembre) {
            premierSeptembre.setFullYear(anneeCourante - 1)
        }
    
        return premierSeptembre
    }, [])


    /**
     * Fires when item is selected
     */
    const handleSelect = useCallback((value: string) => {
        setCurrentValue("")
        ref.current?.blur()
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
                            setFetching(false)
                        })
                        .catch(handleRequestCancellation)
                    break
                case SearchItemType.EVENT:
                    searchEvent(currentValue, 0, tokenSource.token)
                        .then(res => {
                            setData(res.data.content)
                            setFetching(false)
                        })
                        .catch(handleRequestCancellation)
                    break
                case SearchItemType.CLUB:
                    searchClub(currentValue, 0, tokenSource.token)
                        .then(res => {
                            const altered = res.data.content.map(elem => {
                                if(getTakeoverClubLogo(elem.id)!==""){
                                    elem.thumbURL = getTakeoverClubLogo(elem.id)
                                }
                                return elem
                            })
                            setData(altered)
                            setFetching(false)
                        })
                        .catch(handleRequestCancellation)
                    break
                case SearchItemType.ALL:
                default:
                    globalSearch(currentValue, 0, tokenSource.token)
                        .then(res => {
                            if (res.data){
                                setData(res.data.content)
                            }

                            setFetching(false)
                        })
                        .catch(handleRequestCancellation)
                    break
            }
        } else {
            setData([])
        }

        return () => {
            if (source) source.cancel("Operation canceled due to an unmounting component.")
        }
    }, [currentValue, searchType])

    const getLogo = (club:SearchItem) => {
        console.log("getlogo")
        if(!club.thumbURL || club.thumbURL.split("/")[1] === "clb"){
            return mediaPath(club.thumbURL, AvatarSizes.FULL)
        }
        console.log("LOGO uRL:",club.thumbURL)
        return club.thumbURL
    }


    const customDropdownRender = useCallback((menu: React.ReactNode) => {
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
    }, [filter, searchType, t, updateFilter])

    const ref = useRef<RefSelectProps>(null)

    const [nothing, setNothing] = useState<boolean>(false)

    const skeletonWidth = useMemo(() => [1, 2, 3].map(() => Math.floor(Math.random() * 80) + 70), [])

    return (
        <Select
            ref={ref}
            showSearch
            showArrow={false}
            filterOption={false}
            defaultActiveFirstOption={false}
            value={currentValue ? currentValue : undefined}
            placeholder={t("placeholder")}
            className="search-bar my-auto w-4/5 md:w-3/5 lg:w-5/12 xl:w-2/5"
            onInputKeyDown={e => {
                if(e.key === "Enter") {
                    e.stopPropagation()
                    const activeOption = document.querySelector(".ant-select-item-option-active a") as HTMLElement
                    if (activeOption) {
                        activeOption.click()
                    }
                }
            }}
            notFoundContent={
                fetching ?
                    <div>
                        {[1, 2, 3].map((_, i) => 
                            <div className="flex justify-between py-1 pb-[13px]">
                                <div className="inline-flex items-center w-full">
                                    <div className="w-8 h-8 rounded-full bg-neutral-200 animate-pulse" />
                                    <div className="ml-2 leading-4">
                                        <div className="bg-neutral-200 animate-pulse rounded-lg" style={{
                                            width: skeletonWidth[i]+"px"
                                        }}>&nbsp;</div>
                                    </div>                           
                                </div>
                            </div>
                        )}
                    </div> :
                    <div className={"flex flex-col justify-center items-center w-full my-4 space-y-4"}>
                        <img className="h-32 rounded-2xl" src="/img/beer_serving.webp"></img>
                        <span>Tu passes commande ?</span>

                    </div>
                        
            }
            onSearch={setCurrentValue}
            onSelect={handleSelect}
            dropdownRender={customDropdownRender}
            dropdownClassName="search-bar-dropdown rounded-lg shadow-lg border"
            onDropdownVisibleChange={(open) => {
                setTimeout(() =>
                    setNothing(open)
                , 250)
            }}
        >
            {data.map((item) => filter[item.type] &&
                <Option key={`${item.type}-${item.id}`} value={`${item.type.toLowerCase()}/${item.id}`}>
                    <LinkEntityPreloader preview={item}>
                        <Link to={`/${item.type.toLowerCase()}/${item.id}`} className="text-[color:inherit]">
                            <div className="flex justify-between py-1">
                                <div className="inline-flex items-center w-full">
                                    <AvatarSearchType
                                        type={item.type}
                                        text={item.name}
                                        thumbURL={item.thumbURL}
                                        startsAt={item.startsAt}
                                    />
                                    <div className="ml-2 leading-4">
                                        <div className="font-bold">{item.name}</div>
                                        { item.type == SearchItemType.STUDENT && 
                                            <div>Promo {item.description}</div> }
                                        { item.type == SearchItemType.EVENT && 
                                            <div className="">
                                                <div className="absolute top-2 right-2">
                                                    <WebPAvatarPolyfill src={getLogo(item)} size="small" />
                                                </div>
                                                { item.type == SearchItemType.EVENT && item.startsAt && 
                                                    <span className={"inline-flex items-center font-normal rounded-full mt-0.5 text-[#e87a05]"}>
                                                        { _format(item.startsAt,  item.startsAt < lastFirstSeptember ? "d MMM yyyy" : "d MMMM")}
                                                    </span>
                                                }               
                                            </div> 
                                        }
                                    </div>                           
                                </div>
                               
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
