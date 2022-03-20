import React, {useCallback, useReducer, useRef, useState} from "react"
import InfiniteScroller, {InfiniteScrollerRef, loaderCallback} from "../Common/InfiniteScroller"
import {searchStudents} from "../../data/student"
import {useTranslation} from "react-i18next"
import StudentCard from "./StudentCard"
import {FilterReducerAction, StudentPreview} from "../../data/student/types"
import {SearchItem} from "../../data/searchbar/types"
import YearBookSearchBar from "./YearBookSearchBar"
import {EntitySet, mediaPath} from "../../util"
import {faUserAstronaut} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import StudentCardSkeleton from "./StudentCardSkeleton"
import {AvatarSizes} from "../../constants/MediaSizes"

export type StudentFilter = {
    promos: number[]
    atoz: boolean
    name: string
}

const DEFAULT_FILTER: StudentFilter = {
    name: "",
    atoz: true,
    promos: []
}
const reducer: React.Reducer<StudentFilter, FilterReducerAction> = (filter, action) => {
    switch (action.type) {
        case "UPDATE_SEARCH":
            return {
                ...filter,
                name: action.name
            }
        case "ADD_PROMO":
            return {
                ...filter,
                promos: [...filter.promos, action.promo]
            }
        case "REMOVE_PROMO":
            return {
                ...filter,
                promos: [...filter.promos.filter(p => p != action.promo)]
            }
        case "TOGGLE_SORT":
            return {
                ...filter,
                atoz: !filter.atoz
            }
        case "INIT_FILTER":
            return DEFAULT_FILTER
    }
}

const parseSearchResults = (results: SearchItem[]): StudentPreview[] => {
    return results.map(r => {
        const [firstName, lastName] = r.name.split(" ")
        return ({
            id: r.id,
            firstName,
            lastName,
            photoUrlThumb: r.thumbURL,
            picture: r.thumbURL,
            promo: +r.description || -1,
        })
    })
}

const YearBook: React.FC = () => {
    const {t} = useTranslation("discovery")
    const [empty, setEmpty] = useState<boolean>(false)
    const [, setStudents] = useState<EntitySet<StudentPreview>>(new EntitySet())
    const [filteredStudent, setFilteredStudents] = useState<StudentPreview[]>([])
    const [filter, setFilter] = useReducer(reducer, DEFAULT_FILTER)

    const [loading, setLoading] = useState(false)

    const scrollerRef = useRef<InfiniteScrollerRef>(null)

    const filterFn = useCallback((s: StudentPreview) => (
        (!filter.promos.length || filter.promos.includes(s.promo)) && (!filter.name || new RegExp(filter.name, "i").test(s.firstName + " " + s.lastName))
    ), [filter.promos.length, filter.name])

    // Infinite Scroller next students
    const getNextStudents: loaderCallback = useCallback(async (page: number) => {
        setLoading(true)
        const res = await searchStudents(page, filter.name, filter.promos.toString(), filter.atoz)
        if (res.status === 200) {
            const parsedResults = parseSearchResults(res.data.content)

            setStudents(students => {

                setEmpty(empty => {
                    if (page === 0 && res.data.content.length === 0)
                        return true

                    if (res.data.content.length !== 0 && empty)
                        return false

                    return empty
                })

                setLoading(false)
                students.addAll(parsedResults)

                setFilteredStudents(() => (
                    students.toArray()
                        .filter(filterFn)
                        .sort((a, b) => (
                            filter.atoz ? 1 : -1) * +(a.firstName + a.lastName > b.firstName + b.lastName)
                        )
                ))
                return students
            })
            return res.data.last
        }
        setLoading(false)
        return false
    }, [filter])

    useEffect(() => {
        getNextStudents(0)
    }, [getNextStudents])

    const switchSorting = useCallback(() => {
        setFilter({type: "TOGGLE_SORT"})
    }, [scrollerRef])

    const updateFilter = useCallback((action: FilterReducerAction) => {
        setFilter(action)
    }, [])

    return (
        <div className="container mx-auto text-center mt-10">
            <YearBookSearchBar filter={filter} onFilterUpdate={setFilter} onSortingSwitch={switchSorting}/>

            <InfiniteScroller
                ref={scrollerRef}
                empty={empty}
                watch="DOWN"
                callback={getNextStudents}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 place-items-center mt-10 gap-5"
            >
                {filteredStudent.length == 0 && !loading ?
                    <div className="mt-10 mb-2 mx-auto flex flex-col items-center justify-center text-xl text-gray-400">
                        <FontAwesomeIcon icon={faUserAstronaut} size="8x" className="block"/>
                        <span className="text-center mt-5">{t("no_student")}</span>
                    </div> :
                    <>
                        {filteredStudent.map(s =>
                            <StudentCard
                                key={s.id}
                                id={s.id}
                                picture={s.picture}
                                promo={s.promo}
                                fullname={s.firstName + " " + s.lastName}
                                className="opacity-50"
                            />
                        )}
                        {loading && filteredStudent.length == 0 && <>
                            <StudentCardSkeleton/>
                            <StudentCardSkeleton/>
                            <StudentCardSkeleton/>
                            <StudentCardSkeleton/>
                            <StudentCardSkeleton/>
                            <StudentCardSkeleton/>
                        </>}
                    </>
                }
            </InfiniteScroller>
        </div>
    )
}


export default YearBook
